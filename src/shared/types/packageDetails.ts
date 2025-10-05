import { type Packages } from '../constants/packages';

export interface PackageDetails {
  name: Packages;
  id: string;
  src: string;
  alt: Packages;
  featuresHeader: string;
  features: FeatureIcon[];
  tagline: string;
}

interface FeatureIcon {
  featureIcon: string;
  text: string;
}
