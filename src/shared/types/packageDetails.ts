import { type Package } from '../constants/packages';
import { type PictureData } from './pictureData';

export interface PackageDetails {
  name: Package;
  id: string;
  img: PictureData;
  alt: Package;
  featuresHeader: string;
  features: FeatureIcon[];
  tagline: string;
}

interface FeatureIcon {
  featureIcon: string;
  text: string;
}
