import { type TopicName } from '../constants/topicName';

export interface Topic {
  id: string;
  name: TopicName;
  icon?: string;
  label?: string;
  seasonIcon?: string;
}
