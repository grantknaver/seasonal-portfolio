import { type PictureData } from './pictureData';
import { type Lens } from '../constants/lens';

export interface LensDetails {
  name: Lens;
  id: string;
  img: PictureData;
  alt: Lens;
  tagline: string;
  fitLine: string;
  features: FeatureIcon[];
}

interface FeatureIcon {
  featureIcon: string;
  text: string;
}
