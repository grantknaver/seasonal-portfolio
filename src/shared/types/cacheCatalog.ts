import { type DefineComponent } from 'vue';
import { type CaseStudies } from '../constants/caseStudies';
import { type CacheEntry } from '../constants/cacheEntry';

export interface CacheCatelog {
  [CacheEntry.WeatherAndTheme]: DefineComponent | null;
  [CaseStudies.AiChat]: DefineComponent | null;
  [CaseStudies.Waveform]: DefineComponent | null;
  [CacheEntry.Proof]: DefineComponent | null;
  [CacheEntry.RecaptchaWidget]: DefineComponent | null;
  [CacheEntry.CaseStudiesSection]: DefineComponent | null;
  [CacheEntry.PackageSection]: DefineComponent | null;
  [CacheEntry.AboutSection]: DefineComponent | null;
  [CacheEntry.ContactSection]: DefineComponent | null;
}
