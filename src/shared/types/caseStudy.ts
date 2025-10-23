import type { CSSProperties } from 'vue';

export interface Img {
  src: string;
  styles: CSSProperties;
}

export interface CaseStudyHeader {
  text: string;
  subHeader?: string;
  images?: Img[];
}

export interface CaseStudyExpansionTopic {
  id: string;
  icon?: string;
  label?: string;
  text?: string;
  images?: Img[];
  hasSeparator: boolean;
}

export interface CaseStudyExpansionTopicGroup {
  topics: CaseStudyExpansionTopic[];
  hasSeparator: boolean;
}

export interface CaseStudyListItem {
  id: string;
  icon?: string;
  text?: string;
}

export interface CaseStudyListTopic {
  id: string;
  header?: string;
  list?: CaseStudyListItem[];
  hasSeparator: boolean;
}

export interface CaseStudyListTopicGroup {
  topics: CaseStudyListTopic[];
  hasSeparator: boolean;
}
export interface CaseStudyDefaultTopic {
  id: string;
  header: string;
  subHeader?: string;
  text?: string;
  images?: Img[];
  hasSeparator: boolean;
}

export interface CaseStudyDefaultTopicGroup {
  topics: CaseStudyDefaultTopic[];
  hasSeparator: boolean;
}

export interface CaseStudy {
  id: string;
  name: string;
  label: string;
  header: CaseStudyHeader;
  expansionTopics?: CaseStudyExpansionTopicGroup | undefined;
  listTopics?: CaseStudyListTopicGroup | undefined;
  defaultTopics?: CaseStudyDefaultTopicGroup | undefined;
  blockquote?: string | undefined;
}
