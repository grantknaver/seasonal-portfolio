// src/types/assets.d.ts
// Generic image query fallbacks (covers vite-imagetools style ?w=…&format=…&as=…)
declare module '*&as=picture' {
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
  const value: PictureData;
  export default value;
}

declare module '*?as=picture' {
  import type { PictureData } from '*&as=picture';
  const value: PictureData;
  export default value;
}

declare module '*?as=srcset' {
  const value: { src: string; srcset: string };
  export default value;
}
declare module '*&as=srcset' {
  const value: { src: string; srcset: string };
  export default value;
}

// When you import with only ?w=... (no as=...)
declare module '*?w=*' {
  const value: string;
  export default value;
}

// Nice-to-have catch-alls for images with arbitrary queries
declare module '*.jpg?*' {
  const src: string;
  export default src;
}
declare module '*.png?*' {
  const src: string;
  export default src;
}
declare module '*.webp?*' {
  const src: string;
  export default src;
}
declare module '*.avif?*' {
  const src: string;
  export default src;
}
