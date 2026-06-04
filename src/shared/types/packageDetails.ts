import { type Package } from '../constants/packages';
import { type PictureData } from './pictureData';

export interface PackageDetails {
  name: Package;
  id: string;
  img: PictureData;
  alt: Package;
  tagline: string;
  fitLine: string;
  features: FeatureIcon[];
}

interface FeatureIcon {
  featureIcon: string;
  text: string;
}
