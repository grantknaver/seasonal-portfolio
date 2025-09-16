import { type OARole } from './oaRole';

export default interface OALog {
  role: OARole;
  content: InputContent[];
}

interface InputContent {
  type: 'input_text' | 'output_text';
  text: string;
}
