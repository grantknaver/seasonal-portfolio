export interface ResponsiveImageSource {
  avif?: string;
  jpeg?: string;
  webp?: string;
}

export interface ResponsiveImageData {
  src: string;
  h: number;
  w: number;
}

export interface ImageData {
  img: ResponsiveImageData;
  sources: ResponsiveImageSource;
}
