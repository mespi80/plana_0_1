"use client";

import { useState, useCallback } from "react";
import { FileUpload } from "./file-upload";
import { StorageService, UploadResult, STORAGE_FOLDERS } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Image as ImageIcon, 
  X, 
  CheckCircle,
  AlertCircle,
  Loader2,
  RotateCw,
  ZoomIn,
  ZoomOut
} from "lucide-react";

interface ImageUploadProps {
  folder: keyof typeof STORAGE_FOLDERS;
  onUploadComplete: (results: UploadResult[]) => void;
  onUploadError?: (error: string) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  className?: string;
  disabled?: boolean;
  aspectRatio?: number; // width/height ratio
  showPreview?: boolean;
}

export function ImageUpload({
  folder,
  onUploadComplete,
  onUploadError,
  multiple = false,
  maxFiles = 5,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  className = "",
  disabled = false,
  aspectRatio,
  showPreview = true
}: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadResult[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadComplete = useCallback((results: UploadResult[]) => {
    setUploadedImages(prev => [...prev, ...results]);
    onUploadComplete(results);
  }, [onUploadComplete]);

  const handleRemoveImage = useCallback((imageUrl: string) => {
    setUploadedImages(prev => prev.filter(img => img.url !== imageUrl));
  }, []);

  const handleUploadError = useCallback((error: string) => {
    onUploadError?.(error);
  }, [onUploadError]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image Upload Component */}
      <FileUpload
        folder={folder}
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
        multiple={multiple}
        accept="image/*"
        maxFiles={maxFiles}
        maxFileSize={maxFileSize}
        disabled={disabled}
      />

      {/* Uploaded Images Preview */}
      {showPreview && uploadedImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">
            Uploaded Images ({uploadedImages.length})
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {uploadedImages.map((image, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <div className="relative">
                    <img
                      src={image.url}
                      alt={`Uploaded image ${index + 1}`}
                      className={`w-full h-24 object-cover rounded ${
                        aspectRatio ? 'aspect-video' : ''
                      }`}
                      style={aspectRatio ? { aspectRatio: aspectRatio.toString() } : undefined}
                    />
                    
                    {/* Remove Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveImage(image.url)}
                      className="absolute top-1 right-1 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 truncate">
                      {image.path.split('/').pop()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Specialized components for different use cases
export function VenueImageUpload(props: Omit<ImageUploadProps, 'folder'>) {
  return <ImageUpload {...props} folder="VENUE_IMAGES" />;
}

export function EventImageUpload(props: Omit<ImageUploadProps, 'folder'>) {
  return <ImageUpload {...props} folder="EVENT_IMAGES" />;
}

export function AvatarUpload(props: Omit<ImageUploadProps, 'folder' | 'multiple'>) {
  return (
    <ImageUpload 
      {...props} 
      folder="USER_AVATARS" 
      multiple={false}
      maxFiles={1}
      aspectRatio={1}
    />
  );
}

export function BusinessLogoUpload(props: Omit<ImageUploadProps, 'folder' | 'multiple'>) {
  return (
    <ImageUpload 
      {...props} 
      folder="BUSINESS_LOGOS" 
      multiple={false}
      maxFiles={1}
      aspectRatio={16/9}
    />
  );
} 