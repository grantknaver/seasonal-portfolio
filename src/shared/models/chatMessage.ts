import { type QChatMessageProps } from 'quasar';

export interface ChatMessage extends QChatMessageProps {
  id: string;
}
