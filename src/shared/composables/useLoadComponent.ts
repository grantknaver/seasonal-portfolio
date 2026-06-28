import { CacheEntry } from '../constants/cacheEntry';
import { TopicName } from '../constants/topicName';
import { useCacheStore } from 'src/stores/component-cache';
const cacheStore = useCacheStore();

export const useLoadComponent = (topicName: TopicName) => {
  switch (topicName) {
    case TopicName.Examples:
      cacheStore.CACHE_COMPONENT(CacheEntry.ExamplesSection);
      return CacheEntry.ExamplesSection;

    case TopicName.Packages:
      cacheStore.CACHE_COMPONENT(CacheEntry.PackageSection);
      return CacheEntry.PackageSection;

    case TopicName.About:
      cacheStore.CACHE_COMPONENT(CacheEntry.AboutSection);
      return CacheEntry.AboutSection;

    case TopicName.Contact:
      cacheStore.CACHE_COMPONENT(CacheEntry.ContactSection);
      return CacheEntry.ContactSection;
    default:
      console.log('No cache setup');
  }
};
