import { Essay } from '../essay';
import { essayMetadata } from '../meta';

export const metadata = essayMetadata('human-scale');

export default function Page() {
  return <Essay slug="human-scale" />;
}
