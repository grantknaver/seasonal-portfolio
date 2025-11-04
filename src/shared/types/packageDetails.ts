import { type Packages } from '../constants/packages';
import { type PictureData } from './pictureData';

export interface PackageDetails {
  name: Packages;
  id: string;
  img: PictureData;
  alt: Packages;
  featuresHeader: string;
  features: FeatureIcon[];
  tagline: string;
}

interface FeatureIcon {
  featureIcon: string;
  text: string;
}
