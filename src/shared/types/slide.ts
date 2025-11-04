import { type Theme } from '../constants/theme';
import { type PictureData } from './pictureData';

export interface Slide {
  id: string;
  img: PictureData;
  theme: Theme;
  name: string;
}
