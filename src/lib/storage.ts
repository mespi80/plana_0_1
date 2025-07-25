import { supabase } from './supabase';

export interface UploadResult {
  path: string;
  url: string;
  error?: string;
}

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export class StorageService {
  private static readonly BUCKET_NAME = 'plana-assets';
  private static readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

  /**
   * Initialize storage bucket if it doesn't exist
   */
  static async initializeBucket(): Promise<{ error?: string }> {
    if (!supabase) {
      return { error: 'Supabase client not available' };
    }

    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        return { error: listError.message };
      }

      const bucketExists = buckets?.some(bucket => bucket.name === this.BUCKET_NAME);
      
      if (!bucketExists) {
        // Create bucket with public access for images
        const { error: createError } = await supabase.storage.createBucket(this.BUCKET_NAME, {
          public: true,
          allowedMimeTypes: this.ALLOWED_IMAGE_TYPES,
          fileSizeLimit: this.MAX_FILE_SIZE,
        });

        if (createError) {
          return { error: createError.message };
        }
      }

      return {};
    } catch (error) {
      return { error: 'Failed to initialize storage bucket' };
    }
  }

  /**
   * Upload a file to Supabase Storage
   */
  static async uploadFile(
    file: File,
    folder: string,
    options?: {
      generateUniqueName?: boolean;
      resizeImage?: boolean;
      maxWidth?: number;
      maxHeight?: number;
    }
  ): Promise<UploadResult> {
    if (!supabase) {
      return { path: '', url: '', error: 'Supabase client not available' };
    }

    try {
      // Validate file
      const validation = this.validateFile(file);
      if (validation.error) {
        return { path: '', url: '', error: validation.error };
      }

      // Generate unique filename if requested
      const fileName = options?.generateUniqueName 
        ? `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`
        : file.name;

      const filePath = `${folder}/${fileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        return { path: '', url: '', error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      return {
        path: filePath,
        url: urlData.publicUrl,
      };
    } catch (error) {
      return { path: '', url: '', error: 'Failed to upload file' };
    }
  }

  /**
   * Upload multiple files
   */
  static async uploadMultipleFiles(
    files: File[],
    folder: string,
    options?: {
      generateUniqueName?: boolean;
    }
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    for (const file of files) {
      const result = await this.uploadFile(file, folder, options);
      results.push(result);
    }

    return results;
  }

  /**
   * Upload image with optimization
   */
  static async uploadImage(
    file: File,
    folder: string,
    options?: {
      generateUniqueName?: boolean;
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    }
  ): Promise<UploadResult> {
    if (!this.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { path: '', url: '', error: 'Invalid image type. Please use JPEG, PNG, WebP, or GIF.' };
    }

    // For now, we'll upload the original image
    // In a future enhancement, we can add client-side image resizing
    return this.uploadFile(file, folder, {
      ...options,
      generateUniqueName: options?.generateUniqueName ?? true,
    });
  }

  /**
   * Delete a file from storage
   */
  static async deleteFile(filePath: string): Promise<{ error?: string }> {
    if (!supabase) {
      return { error: 'Supabase client not available' };
    }

    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'Failed to delete file' };
    }
  }

  /**
   * Delete multiple files
   */
  static async deleteMultipleFiles(filePaths: string[]): Promise<{ error?: string }> {
    if (!supabase) {
      return { error: 'Supabase client not available' };
    }

    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove(filePaths);

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'Failed to delete files' };
    }
  }

  /**
   * Get public URL for a file
   */
  static getPublicUrl(filePath: string): string {
    if (!supabase) {
      return '';
    }

    const { data } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * List files in a folder
   */
  static async listFiles(folder: string): Promise<{ files: string[]; error?: string }> {
    if (!supabase) {
      return { files: [], error: 'Supabase client not available' };
    }

    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(folder);

      if (error) {
        return { files: [], error: error.message };
      }

      const files = data?.map(item => `${folder}/${item.name}`) || [];
      return { files };
    } catch (error) {
      return { files: [], error: 'Failed to list files' };
    }
  }

  /**
   * Validate file before upload
   */
  private static validateFile(file: File): { error?: string } {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return { error: `File size must be less than ${this.MAX_FILE_SIZE / (1024 * 1024)}MB` };
    }

    // Check if it's an image
    if (this.ALLOWED_IMAGE_TYPES.includes(file.type) && file.size > this.MAX_IMAGE_SIZE) {
      return { error: `Image size must be less than ${this.MAX_IMAGE_SIZE / (1024 * 1024)}MB` };
    }

    return {};
  }

  /**
   * Generate optimized image URL with transformations
   */
  static getOptimizedImageUrl(
    imageUrl: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'jpeg' | 'png';
    }
  ): string {
    // For now, return the original URL
    // In the future, we can integrate with image optimization services
    return imageUrl;
  }

  /**
   * Get file metadata
   */
  static async getFileMetadata(filePath: string): Promise<{ metadata?: any; error?: string }> {
    if (!supabase) {
      return { error: 'Supabase client not available' };
    }

    try {
      const { data } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      // For now, return basic metadata
      // In the future, we can fetch more detailed metadata
      return { metadata: { url: data.publicUrl } };
    } catch (error) {
      return { error: 'Failed to get file metadata' };
    }
  }
}

// Predefined folders for different types of content
export const STORAGE_FOLDERS = {
  VENUE_IMAGES: 'venues',
  EVENT_IMAGES: 'events',
  USER_AVATARS: 'avatars',
  BUSINESS_LOGOS: 'businesses',
  DOCUMENTS: 'documents',
  QR_CODES: 'qr-codes',
} as const; 