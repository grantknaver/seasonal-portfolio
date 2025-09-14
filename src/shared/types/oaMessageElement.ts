import { type OARole } from './oaRole';

export default interface OAMessageElement {
  role: OARole;
  content: InputContent[];
}

interface InputContent {
  type: 'text';
  text: string;
}
