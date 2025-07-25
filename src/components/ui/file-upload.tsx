"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  File, 
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { StorageService, UploadResult, STORAGE_FOLDERS } from "@/lib/storage";

interface FileUploadProps {
  folder: keyof typeof STORAGE_FOLDERS;
  onUploadComplete: (results: UploadResult[]) => void;
  onUploadError?: (error: string) => void;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  maxFileSize?: number;
  className?: string;
  disabled?: boolean;
}

interface FileWithPreview extends File {
  preview?: string;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  uploadResult?: UploadResult;
}

export function FileUpload({
  folder,
  onUploadComplete,
  onUploadError,
  multiple = false,
  accept = "image/*",
  maxFiles = 5,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  className = "",
  disabled = false
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize) {
      return `File size must be less than ${maxFileSize / (1024 * 1024)}MB`;
    }

    // Check file type
    if (accept !== "*" && !file.type.match(accept.replace("*", ".*"))) {
      return `File type not allowed. Please use: ${accept}`;
    }

    return null;
  }, [accept, maxFileSize]);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles: FileWithPreview[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        onUploadError?.(error);
        continue;
      }

      // Check if we've reached the max files limit
      if (files.length + validFiles.length >= maxFiles) {
        onUploadError?.(`Maximum ${maxFiles} files allowed`);
        break;
      }

      const fileWithPreview: FileWithPreview = {
        ...file,
        uploadStatus: 'pending',
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          fileWithPreview.preview = e.target?.result as string;
          setFiles(prev => [...prev]);
        };
        reader.readAsDataURL(file);
      }

      validFiles.push(fileWithPreview);
    }

    setFiles(prev => [...prev, ...validFiles]);
  }, [files.length, maxFiles, validateFile, onUploadError]);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const uploadFiles = useCallback(async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const results: UploadResult[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Update status to uploading
        setFiles(prev => prev.map((f, index) => 
          index === i ? { ...f, uploadStatus: 'uploading' } : f
        ));

        const result = await StorageService.uploadFile(
          file,
          STORAGE_FOLDERS[folder],
          { generateUniqueName: true }
        );

        // Update status based on result
        setFiles(prev => prev.map((f, index) => 
          index === i ? { 
            ...f, 
            uploadStatus: result.error ? 'error' : 'success',
            uploadResult: result
          } : f
        ));

        results.push(result);

        if (result.error) {
          onUploadError?.(result.error);
        }
      }

      // Call completion callback with successful uploads
      const successfulResults = results.filter(r => !r.error);
      if (successfulResults.length > 0) {
        onUploadComplete(successfulResults);
      }
    } catch (error) {
      onUploadError?.('Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [files, folder, onUploadComplete, onUploadError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  }, [addFiles, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      addFiles(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [addFiles]);

  const getStatusIcon = (status: FileWithPreview['uploadStatus']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <CardContent className="p-6 text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            {isDragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-gray-500">
            {accept === "image/*" ? "Images" : "Files"} up to {maxFileSize / (1024 * 1024)}MB
          </p>
          {multiple && (
            <p className="text-xs text-gray-500">
              Maximum {maxFiles} files
            </p>
          )}
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              Selected Files ({files.length})
            </h4>
            <Button
              onClick={uploadFiles}
              disabled={isUploading || disabled}
              size="sm"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {files.map((file, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-3">
                  <div className="flex items-start space-x-3">
                    {/* Preview */}
                    <div className="flex-shrink-0">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <File className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {file.uploadStatus && (
                        <div className="flex items-center mt-1">
                          {getStatusIcon(file.uploadStatus)}
                          <span className="text-xs text-gray-500 ml-1">
                            {file.uploadStatus === 'uploading' && 'Uploading...'}
                            {file.uploadStatus === 'success' && 'Uploaded'}
                            {file.uploadStatus === 'error' && 'Failed'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </Button>
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