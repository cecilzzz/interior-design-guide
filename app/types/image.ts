export type ImageData = {
  localPath: {
    originalFileName: string;
    articleSlug: string;
  }
  seo: {
    seoFileName: string;
    altText: string;
  };
  pin: {
    title: string;
    description: string;
  };
  className?: string;
};
