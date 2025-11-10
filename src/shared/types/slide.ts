import { type Theme } from '../constants/theme';
import { type ImageData } from './imageData';

export interface Slide {
  id: string;
  picture: ImageData;
  theme: Theme;
  name: string;
}
