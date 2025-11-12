export interface ResponsiveImageSource {
  avif?: string;
  jpeg?: string;
  webp?: string;
}

export interface ResponsiveImageData {
  src: string;
  w: number; // width
  h: number; // height
}

export interface PictureData {
  img: ResponsiveImageData;
  sources: ResponsiveImageSource;
}
