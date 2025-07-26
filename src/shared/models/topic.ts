import { type Theme } from '../constants/theme';
import { type TopicName } from '../constants/topicName';

export interface Topic {
  id: string;
  name: TopicName;
  icon?: string;
  label?: string;
  theme?: Theme;
  seasonIcon?: string;
}
