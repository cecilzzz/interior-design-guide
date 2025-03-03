declare module 'next-cloudinary/server' {
  export interface CldUploadApiOptions {
    public_id?: string;
    tags?: string[];
    context?: Record<string, string>;
    transformation?: Array<Record<string, string>>;
  }

  export interface CldUploadApiResult {
    secure_url: string;
    public_id: string;
    version: string;
    width: number;
    height: number;
    format: string;
    created_at: string;
    resource_type: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    url: string;
    signature: string;
    original_filename: string;
  }

  export const CldUploadApi: {
    upload: (
      file: string,
      options?: CldUploadApiOptions
    ) => Promise<CldUploadApiResult>;
  };
} 