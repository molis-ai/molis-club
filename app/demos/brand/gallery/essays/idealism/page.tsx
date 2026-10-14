import { Essay } from '../essay';
import { essayMetadata } from '../meta';

export const metadata = essayMetadata('idealism');

export default function Page() {
  return <Essay slug="idealism" />;
}
