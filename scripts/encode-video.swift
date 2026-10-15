// 新站视频的本地压缩：用 macOS 自带的 AVFoundation 把素材重新编码成指定宽度与码率的 H.264（去掉音轨、快速起播），
// 再取一帧做封面。不新增依赖，只在本机执行：
//   swift scripts/encode-video.swift <源文件> <输出.mp4> <宽度> <码率kbps> [截取秒数] [封面输出.jpg] [封面时间秒]
// 选用的参数记在 DESIGN.md「配图与视频」。

import AVFoundation
import CoreImage
import Foundation

let args = CommandLine.arguments
guard args.count >= 5 else {
  print("usage: encode-video.swift <in> <out.mp4> <width> <kbps> [seconds] [poster.jpg] [posterAt]")
  exit(1)
}
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])
let width = Int(args[3])!
let kbps = Int(args[4])!
let seconds = args.count > 5 ? Double(args[5]) : nil
let posterURL = args.count > 6 ? URL(fileURLWithPath: args[6]) : nil
let posterAt = args.count > 7 ? Double(args[7])! : 0.5

let asset = AVURLAsset(url: input)
let semaphore = DispatchSemaphore(value: 0)

func run() async throws {
  guard let track = try await asset.loadTracks(withMediaType: .video).first else {
    throw NSError(domain: "encode", code: 1)
  }
  let natural = try await track.load(.naturalSize)
  let fps = try await track.load(.nominalFrameRate)
  let height = Int((Double(width) * Double(natural.height) / Double(natural.width) / 2).rounded()) * 2
  let duration = try await asset.load(.duration)
  let end = seconds.map { CMTime(seconds: min($0, duration.seconds), preferredTimescale: 600) } ?? duration

  try? FileManager.default.removeItem(at: output)
  let reader = try AVAssetReader(asset: asset)
  reader.timeRange = CMTimeRange(start: .zero, end: end)
  let readerOutput = AVAssetReaderTrackOutput(
    track: track,
    outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA]
  )
  reader.add(readerOutput)

  let writer = try AVAssetWriter(outputURL: output, fileType: .mp4)
  writer.shouldOptimizeForNetworkUse = true
  let writerInput = AVAssetWriterInput(
    mediaType: .video,
    outputSettings: [
      AVVideoCodecKey: AVVideoCodecType.h264,
      AVVideoWidthKey: width,
      AVVideoHeightKey: height,
      AVVideoScalingModeKey: AVVideoScalingModeResizeAspectFill,
      AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: kbps * 1000,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        AVVideoMaxKeyFrameIntervalKey: Int(fps.rounded()) * 2,
        AVVideoAllowFrameReorderingKey: true,
      ],
    ]
  )
  writerInput.expectsMediaDataInRealTime = false
  writer.add(writerInput)

  reader.startReading()
  writer.startWriting()
  writer.startSession(atSourceTime: .zero)
  while reader.status == .reading {
    if writerInput.isReadyForMoreMediaData {
      if let sample = readerOutput.copyNextSampleBuffer() {
        writerInput.append(sample)
      } else {
        break
      }
    } else {
      try await Task.sleep(nanoseconds: 2_000_000)
    }
  }
  writerInput.markAsFinished()
  await writer.finishWriting()
  if writer.status != .completed { throw writer.error ?? NSError(domain: "encode", code: 2) }

  if let posterURL {
    let generator = AVAssetImageGenerator(asset: AVURLAsset(url: output))
    generator.appliesPreferredTrackTransform = true
    generator.requestedTimeToleranceBefore = .zero
    generator.requestedTimeToleranceAfter = .zero
    let (image, _) = try await generator.image(at: CMTime(seconds: posterAt, preferredTimescale: 600))
    let context = CIContext()
    let ci = CIImage(cgImage: image)
    try context.writeJPEGRepresentation(
      of: ci, to: posterURL, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!,
      options: [kCGImageDestinationLossyCompressionQuality as CIImageRepresentationOption: 0.9])
  }
  let size = (try FileManager.default.attributesOfItem(atPath: output.path)[.size] as? Int) ?? 0
  print("\(output.lastPathComponent) \(width)x\(height) \(kbps)kbps \(String(format: "%.1f", end.seconds))s \(size / 1024)KB")
}

Task {
  do { try await run() } catch { print("error: \(error)"); exit(2) }
  semaphore.signal()
}
semaphore.wait()
