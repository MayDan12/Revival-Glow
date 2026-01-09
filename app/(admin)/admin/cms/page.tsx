"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/utils/supabase/client";
import { ImageIcon, Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";

interface UploadProgress {
  [key: number]: number;
}

interface ImageFile {
  file: File;
  preview: string;
  index: number;
}

export default function AddingImagesToUse() {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];

    setIsUploading(true);
    setUploadProgress({});

    const uploadedUrls: string[] = [];

    try {
      for (const imageFile of imageFiles) {
        const file = imageFile.file;
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()
          .toString(36)
          .substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Simulate progress since Supabase doesn't support progress tracking
        // Start with 0% progress
        setUploadProgress((prev) => ({
          ...prev,
          [imageFile.index]: 0,
        }));

        // Simulate progress updates (this is a workaround since Supabase doesn't provide progress)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const currentProgress = prev[imageFile.index] || 0;
            if (currentProgress < 90) {
              return {
                ...prev,
                [imageFile.index]: currentProgress + 10,
              };
            }
            return prev;
          });
        }, 200);

        // Upload file to Supabase
        const { error: uploadError } = await supabase.storage
          .from("contents")
          .upload(fileName, file);

        // Clear the progress simulation
        clearInterval(progressInterval);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error(
            `Failed to upload ${file.name}: ${uploadError.message}`
          );
        }

        // Set to 100% when upload is complete
        setUploadProgress((prev) => ({
          ...prev,
          [imageFile.index]: 100,
        }));

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("contents").getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);

        // Clean up object URL
        URL.revokeObjectURL(imageFile.preview);

        // Small delay to show 100% progress
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      return uploadedUrls;
    } catch (error) {
      // Clean up all object URLs on error
      imageFiles.forEach((imageFile) => URL.revokeObjectURL(imageFile.preview));
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const uploadedUrls = await uploadImages();
      setStatus({
        type: "success",
        message: `Successfully uploaded ${uploadedUrls.length} images!`,
      });
      //   I want to store it in a content table just storing name of the image and images urls in a json array
      await supabase.from("contents").insert({
        name: "images",
        value: uploadedUrls,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Upload failed",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImageFiles: ImageFile[] = [];

    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setStatus({
          type: "error",
          message: `File ${file.name} is not an image. Please select image files only.`,
        });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setStatus({
          type: "error",
          message: `File ${file.name} is too large. Maximum size is 5MB.`,
        });
        return;
      }

      const preview = URL.createObjectURL(file);
      newImageFiles.push({
        file,
        preview,
        index: imageFiles.length + newImageFiles.length,
      });
    });

    setImageFiles((prev) => [...prev, ...newImageFiles]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Create a fake event to reuse handleFileSelect
      const fakeEvent = {
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      // Update indices
      return newFiles.map((file, i) => ({ ...file, index: i }));
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Images - Updated for file upload */}
        <Card>
          <CardContent>
            <h3 className="font-medium text-foreground mb-2">
              Product Images *
            </h3>

            {/* File Upload Area */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg px-6 py-3 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                accept="image/*"
                className="hidden"
              />
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                Drag & drop images here or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports JPG, PNG, WEBP • Max 5MB per image
              </p>
            </div>

            {/* Image Previews */}
            {imageFiles.length > 0 && (
              <div className="mt-4">
                <Label className="mb-1 block">
                  Selected Images ({imageFiles.length})
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imageFiles.map((imageFile, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg border overflow-hidden bg-gray-100">
                        <img
                          src={imageFile.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {uploadProgress[index] !== undefined &&
                          uploadProgress[index] < 100 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <div className="text-white text-sm">
                                {uploadProgress[index]}%
                              </div>
                            </div>
                          )}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="mt-3">
                <Label>Uploading Images...</Label>
                <div className="space-y-2 mt-2">
                  {imageFiles.map((imageFile, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <ImageIcon className="h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span className="truncate">
                            {imageFile.file.name}
                          </span>
                          <span>{uploadProgress[index] || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[index] || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Submit Button */}
            <Button type="submit" className="mt-4">
              Upload Images
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
