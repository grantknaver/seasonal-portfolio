export interface CaseStudyHeader {
  text: string;
  subHeader?: string;
}

export interface CaseStudyExpansionTopic {
  id: string;
  icon?: string;
  label?: string;
  text?: string;
  name: string;
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
  name: string;
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
  name?: string;
  subHeader?: string;
  text?: string;
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
