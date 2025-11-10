import { type Packages } from '../constants/packages';
import { type ImageData } from './imageData';

export interface PackageDetails {
  name: Packages;
  id: string;
  img: ImageData;
  alt: Packages;
  featuresHeader: string;
  features: FeatureIcon[];
  tagline: string;
}

interface FeatureIcon {
  featureIcon: string;
  text: string;
}
