import { defineStore } from 'pinia';
import { defineAsyncComponent, markRaw, reactive, type DefineComponent } from 'vue';
import { CacheEntry } from 'src/shared/constants/cacheEntry';
import { capitalize } from 'vue';

// Combine CacheEntry and CaseStudies into one type

// Define the catalog type
type CacheCatalog = Record<CacheEntry, DefineComponent | null>;

export const useCacheStore = defineStore('cache', () => {
  // Initialize catalog with all keys set to null

  // Initialize catalog with all keys set to null
  const catalog: CacheCatalog = reactive({
    [CacheEntry.WeatherAndTheme]: null,
    [CacheEntry.AiChat]: null,
    [CacheEntry.Waveform]: null,
    [CacheEntry.Proof]: null,
    [CacheEntry.RecaptchaWidget]: null,
    [CacheEntry.CaseStudiesSection]: null,
    [CacheEntry.PackageSection]: null,
    [CacheEntry.AboutSection]: null,
    [CacheEntry.ContactSection]: null,
  });

  const CACHE_COMPONENT = (name: CacheEntry) => {
    if (name) {
      const component = defineAsyncComponent(
        () => import(`../components/${capitalize(name)}.vue`),
      ) as DefineComponent;
      catalog[name] = markRaw(component); // Cache the component
      console.log('catalog', catalog);
      // console.log('catalog', catalog);
    }
  };

  const GET_COMPONENT = (name: CacheEntry) => catalog[name];

  const CLEAR_CACHE = () => {
    catalog.aboutSection = null;
    catalog['ai-chat'] = null;
    catalog.caseStudiesSection = null;
    catalog.contactSection = null;
    catalog.packageSection = null;
    catalog.proof = null;
    catalog.recaptchaWidget = null;
    catalog.waveform = null;
    catalog['weather-and-theme'] = null;
  };

  return { catalog, CACHE_COMPONENT, GET_COMPONENT, CLEAR_CACHE };
});
