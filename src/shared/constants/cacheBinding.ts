import { CacheEntry } from './cacheEntry';
import { TopicName } from './topicName';

export const CacheBinding = {
  [TopicName.CaseStudies]: CacheEntry.CaseStudiesSection,
  [TopicName.About]: CacheEntry.AboutSection,
  [TopicName.Contact]: CacheEntry.ContactSection,
  [TopicName.Packages]: CacheEntry.PackageSection,
};
