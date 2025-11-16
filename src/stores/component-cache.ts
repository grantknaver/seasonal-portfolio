import { defineStore } from 'pinia';
import { defineAsyncComponent, markRaw, reactive, type DefineComponent } from 'vue';
import { CacheEntry } from 'src/shared/constants/cacheEntry';
import { capitalize } from 'vue';

type CacheCatalog = Record<CacheEntry, DefineComponent | null>;

export const useCacheStore = defineStore('cache', () => {
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
    if (!name || catalog[name]) return;

    const component = defineAsyncComponent({
      loader: () => import(`../components/${capitalize(name)}.vue`),
      delay: 0, // show skeleton immediately
    }) as DefineComponent;

    catalog[name] = markRaw(component);
  };

  const GET_COMPONENT = (name: CacheEntry) => catalog[name];

  const CLEAR_CACHE = () => {
    (Object.keys(catalog) as CacheEntry[]).forEach((key) => {
      catalog[key] = null;
    });
  };

  return { catalog, CACHE_COMPONENT, GET_COMPONENT, CLEAR_CACHE };
});
