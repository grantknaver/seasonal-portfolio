import { CacheEntry } from './cacheEntry';
import { TopicName } from './topicName';

export const CacheBinding = {
  [TopicName.About]: CacheEntry.AboutSection,
  [TopicName.Contact]: CacheEntry.ContactSection,
  [TopicName.Packages]: CacheEntry.PackageSection,
  [TopicName.Lens]: CacheEntry.LensSection,
  [TopicName.Examples]: CacheEntry.ExamplesSection,
};
