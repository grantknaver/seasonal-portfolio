export interface ResponsiveImageSource {
  type: string;
  srcset: string;
}
export interface ResponsiveImageData {
  src: string;
  srcset: string;
  width: number;
  height: number;
  format: string;
}
export interface PictureData {
  sources: ResponsiveImageSource[];
  img: ResponsiveImageData;
}
