export interface CaseStudyHeader {
  text?: string;
  subHeader?: string;
}

export interface CaseStudyExpansionTopic {
  icon?: string;
  label?: string;
  text?: string;
}

export interface CaseStudyListItem {
  icon?: string;
  text?: string;
}

export interface CaseStudyListTopic {
  header?: string;
  list?: CaseStudyListItem[];
}

export interface CaseStudyDefaultTopic {
  header: string;
  subHeader?: string;
  text?: string;
}

export interface CaseStudy {
  header: CaseStudyHeader;
  expansionTopics: CaseStudyExpansionTopic[];
  listTopics: CaseStudyListTopic[];
  defaultTopics: CaseStudyDefaultTopic[];
  blockquote: string;
}
