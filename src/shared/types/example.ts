export interface ExampleHeader {
  text: string;
  subHeader?: string;
  icon?: string;
}

export interface ExampleExpansionTopic {
  id: string;
  icon?: string;
  label?: string;
  text?: string;
  name: string;
  hasSeparator: boolean;
}

export interface ExampleExpansionTopicGroup {
  topics: ExampleExpansionTopic[];
  hasSeparator: boolean;
}

export interface ExampleListItem {
  id: string;
  icon?: string;
  text?: string;
}

export interface ExampleListTopic {
  id: string;
  header?: string;
  name: string;
  list?: ExampleListItem[];
  hasSeparator: boolean;
}

export interface ExampleListTopicGroup {
  topics: ExampleListTopic[];
  hasSeparator: boolean;
}
export interface ExampleDefaultTopic {
  id: string;
  header: string;
  name?: string;
  subHeader?: string;
  text?: string;
  hasSeparator: boolean;
}

export interface ExampleDefaultTopicGroup {
  topics: ExampleDefaultTopic[];
  hasSeparator: boolean;
}

export interface Example {
  id: string;
  name: string;
  label: string;
  header: ExampleHeader;
  expansionTopics?: ExampleExpansionTopicGroup | undefined;
  listTopics?: ExampleListTopicGroup | undefined;
  defaultTopics?: ExampleDefaultTopicGroup | undefined;
  blockquote?: string | undefined;
}
