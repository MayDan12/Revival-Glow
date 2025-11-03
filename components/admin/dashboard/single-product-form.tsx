"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Plus,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { supabase } from "@/utils/supabase/client";
import { Product } from "@/types/product";

const CATEGORIES = [
  "Cleansers",
  "Serums",
  "Moisturizers",
  "Masks",
  "Sunscreen",
  "Eye Care",
];

const SKIN_TYPES = [
  "All Skin Types",
  "Dry Skin",
  "Oily Skin",
  "Combination",
  "Sensitive",
  "Mature",
];

// Initial empty product state
const initialProductState: Product = {
  id: 0,
  name: "",
  price: 0,
  originalPrice: null,
  images: [],
  category: "",
  skinType: [],
  description: "",
  isNew: false,
  isBestseller: false,
  rating: 0,
  reviewCount: 0,
  ingredients: [""],
  benefits: [""],
  howToUse: "",
  stock_quantity: 0,
};

// Types for upload progress
interface UploadProgress {
  [key: number]: number;
}

interface ImageFile {
  file: File;
  preview: string;
  index: number;
}

export function SingleProductForm() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<Product>(initialProductState);
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
  const [isLoading, setIsLoading] = useState(false);

  // Handle file selection
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

  // Remove image from selection
  const removeImage = (index: number) => {
    setImageFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      // Update indices
      return newFiles.map((file, i) => ({ ...file, index: i }));
    });
  };

  // Upload images to Supabase Storage with simulated progress
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
          .from("products")
          .upload(filePath, file);

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
        } = supabase.storage.from("products").getPublicUrl(filePath);

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

  // Alternative approach: Upload with fetch for real progress tracking
  const uploadWithProgress = async (
    file: File,
    index: number
  ): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()
      .toString(36)
      .substring(2)}-${Date.now()}.${fileExt}`;

    // Get upload URL from Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("products")
      .createSignedUploadUrl(fileName);

    if (uploadError) throw uploadError;

    // Use fetch to upload with progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress((prev) => ({
            ...prev,
            [index]: percent,
          }));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const publicUrl = supabase.storage
            .from("products")
            .getPublicUrl(fileName).data.publicUrl;
          resolve(publicUrl);
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.open("PUT", uploadData.signedUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  };

  // Updated upload function using the alternative approach
  const uploadImagesWithRealProgress = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];

    setIsUploading(true);
    setUploadProgress({});

    const uploadedUrls: string[] = [];

    try {
      for (const imageFile of imageFiles) {
        const publicUrl = await uploadWithProgress(
          imageFile.file,
          imageFile.index
        );
        uploadedUrls.push(publicUrl);

        // Clean up object URL
        URL.revokeObjectURL(imageFile.preview);
      }

      return uploadedUrls;
    } catch (error) {
      // Clean up all object URLs on error
      imageFiles.forEach((imageFile) => URL.revokeObjectURL(imageFile.preview));
      throw error;
    } finally {
      setIsUploading(false);
      // Keep progress visible for a moment after completion
      setTimeout(() => setUploadProgress({}), 1000);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const handleSkinTypeChange = (skinType: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      skinType: checked
        ? [...prev.skinType, skinType]
        : prev.skinType.filter((s) => s !== skinType),
    }));
  };

  // Handle array field changes (ingredients, benefits)
  const handleArrayFieldChange = (
    field: "ingredients" | "benefits",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  // Add new item to array field
  const addArrayFieldItem = (field: "ingredients" | "benefits") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  // Remove item from array field
  const removeArrayFieldItem = (
    field: "ingredients" | "benefits",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setStatus({ type: "error", message: "Product name is required" });
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      setStatus({ type: "error", message: "Valid price is required" });
      return false;
    }
    if (!formData.category) {
      setStatus({ type: "error", message: "Category is required" });
      return false;
    }
    if (formData.skinType.length === 0) {
      setStatus({ type: "error", message: "Select at least one skin type" });
      return false;
    }
    if (!formData.description.trim()) {
      setStatus({ type: "error", message: "Description is required" });
      return false;
    }
    if (imageFiles.length === 0) {
      setStatus({ type: "error", message: "At least one image is required" });
      return false;
    }
    if (formData.stock_quantity < 0) {
      setStatus({
        type: "error",
        message: "Stock quantity must be at least 0",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!session?.user?.id) {
      setStatus({
        type: "error",
        message: "You must be logged in to add a product.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Upload images first - using the real progress version
      const imageUrls = await uploadImagesWithRealProgress();

      if (imageUrls.length === 0) {
        throw new Error("No images were uploaded successfully.");
      }

      // Filter out empty array items
      const cleanFormData = {
        ...formData,
        images: imageUrls, // Use uploaded URLs
        ingredients: formData.ingredients.filter((ing) => ing.trim() !== ""),
        benefits: formData.benefits.filter((ben) => ben.trim() !== ""),
      };

      const productData = {
        name: cleanFormData.name.trim(),
        price: cleanFormData.price,
        original_price: cleanFormData.originalPrice,
        images: cleanFormData.images,
        category: cleanFormData.category,
        skin_types: cleanFormData.skinType,
        description: cleanFormData.description.trim(),
        is_new: cleanFormData.isNew,
        is_bestseller: cleanFormData.isBestseller,
        rating: cleanFormData.rating,
        review_count: cleanFormData.reviewCount,
        ingredients: cleanFormData.ingredients,
        benefits: cleanFormData.benefits,
        how_to_use: cleanFormData.howToUse.trim(),
        seller_id: session.user.id,
        stock_quantity: cleanFormData.stock_quantity,
      };

      console.log("📦 Product Data being sent:", productData);

      const { data, error } = await supabase
        .from("products")
        .insert([productData])
        .select();

      if (error) {
        console.error("❌ Supabase Error:", error);
        throw error;
      }

      console.log("✅ Insert successful:", data);

      setStatus({
        type: "success",
        message: `Product "${cleanFormData.name}" added successfully!`,
      });

      // Reset form
      setFormData(initialProductState);
      setImageFiles([]);

      setTimeout(() => setStatus({ type: null, message: "" }), 3000);
    } catch (error) {
      console.error("❌ Caught error:", error);
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to add product. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Drag and drop handlers
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Information */}
      <Card>
        <CardContent>
          <h3 className="font-medium text-foreground mb-2">
            Basic Information
          </h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Hydrating Serum"
                className="mt-1 border-accent-foreground/40"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="stock_quantity">Stock *</Label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="mt-1 border-accent-foreground/40"
                />
              </div>
              <div>
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="mt-1 border-accent-foreground/40"
                />
              </div>
              <div>
                <Label htmlFor="originalPrice">Original Price ($)</Label>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      originalPrice: e.target.value
                        ? Number(e.target.value)
                        : null,
                    }))
                  }
                  placeholder="0.00 (optional)"
                  className="mt-1 border-accent-foreground/40"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product..."
                rows={4}
                className="mt-1 border-accent-foreground/40"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images - Updated for file upload */}
      <Card>
        <CardContent>
          <h3 className="font-medium text-foreground mb-2">Product Images *</h3>

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
                        <span className="truncate">{imageFile.file.name}</span>
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
        </CardContent>
      </Card>

      {/* Rest of your form components remain the same */}
      {/* Category & Skin Type */}
      <Card>
        <CardContent>
          <h3 className="font-medium text-foreground mb-2">
            Category & Skin Type
          </h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="mb-3 block">Skin Types *</Label>
              <div className="grid grid-cols-2 gap-2">
                {SKIN_TYPES.map((skinType) => (
                  <div key={skinType} className="flex items-center space-x-2">
                    <Checkbox
                      id={skinType}
                      checked={formData.skinType.includes(skinType)}
                      onCheckedChange={(checked) =>
                        handleSkinTypeChange(skinType, checked as boolean)
                      }
                      className="border-accent-foreground/40"
                    />
                    <Label
                      htmlFor={skinType}
                      className="text-sm cursor-pointer"
                    >
                      {skinType}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ingredients */}
      <Card>
        <CardContent>
          <h3 className="font-medium text-foreground mb-2">Ingredients</h3>
          <div className="space-y-2">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={ingredient}
                  onChange={(e) =>
                    handleArrayFieldChange("ingredients", index, e.target.value)
                  }
                  placeholder="e.g., Jojoba Oil: Deeply moisturizes without clogging pores"
                  className="flex-1 border-accent-foreground/40"
                />
                {formData.ingredients.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-accent-foreground/40"
                    size="icon"
                    onClick={() => removeArrayFieldItem("ingredients", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayFieldItem("ingredients")}
              className="w-full border-accent-foreground/40"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Ingredient
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardContent>
          <h3 className="font-medium text-foreground mb-2">Benefits</h3>
          <div className="space-y-2">
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={benefit}
                  onChange={(e) =>
                    handleArrayFieldChange("benefits", index, e.target.value)
                  }
                  placeholder="e.g., Gently removes makeup and impurities"
                  className="flex-1 border-accent-foreground/40"
                />
                {formData.benefits.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayFieldItem("benefits", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayFieldItem("benefits")}
              className="w-full border-accent-foreground/40"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Benefit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How to Use */}
      <Card>
        <CardContent>
          <h3 className="font-medium text-foreground mb-2">How to Use</h3>
          <Textarea
            name="howToUse"
            value={formData.howToUse}
            onChange={handleInputChange}
            placeholder="Describe how to use the product..."
            rows={4}
            className="border-accent-foreground/40"
          />
        </CardContent>
      </Card>

      {/* Flags */}
      <Card>
        <CardContent>
          <h3 className="font-medium text-foreground mb-2">Product Flags</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isNew"
                checked={formData.isNew}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("isNew", checked as boolean)
                }
                className="border-accent-foreground/40"
              />
              <Label htmlFor="isNew" className="cursor-pointer">
                Mark as New
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isBestseller"
                checked={formData.isBestseller}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("isBestseller", checked as boolean)
                }
                className="border-accent-foreground/40"
              />
              <Label htmlFor="isBestseller" className="cursor-pointer">
                Mark as Bestseller
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Messages */}
      {status.type && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`flex items-center gap-3 p-4 rounded-lg ${
            status.type === "success"
              ? "bg-green-50 text-green-900"
              : "bg-red-50 text-red-900"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{status.message}</span>
        </motion.div>
      )}

      {/* Submit Button */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isLoading || isUploading}
          className="flex-1"
        >
          {isUploading
            ? "Uploading Images..."
            : isLoading
            ? "Adding Product..."
            : "Add Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData(initialProductState);
            setImageFiles([]);
          }}
          className="border-accent-foreground/40"
        >
          Clear
        </Button>
      </div>
    </form>
  );
}
