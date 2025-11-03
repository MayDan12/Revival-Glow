// "use client";

// import type React from "react";

// import { useState, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { motion } from "framer-motion";
// import { AlertCircle, CheckCircle2, Upload, Download } from "lucide-react";
// import Papa from "papaparse";

// interface CSVProduct {
//   name: string;
//   price: string;
//   original_price: string;
//   image: string;
//   category: string;
//   skin_types: string;
//   description: string;
//   is_new: string;
//   is_bestseller: string;
// }

// export function BulkProductUpload() {
//   const [status, setStatus] = useState<{
//     type: "success" | "error" | null;
//     message: string;
//   }>({
//     type: null,
//     message: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [uploadedCount, setUploadedCount] = useState(0);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const downloadTemplate = () => {
//     const headers = [
//       "name",
//       "price",
//       "original_price",
//       "image",
//       "category",
//       "skin_types",
//       "description",
//       "is_new",
//       "is_bestseller",
//     ];
//     const exampleRow = [
//       "Hydrating Serum",
//       "65",
//       "",
//       "/elegant-skincare-serum-bottle-with-dropper.jpg",
//       "Serums",
//       '"All Skin Types,Dry Skin"',
//       "Intensive hydration serum with hyaluronic acid",
//       "true",
//       "false",
//     ];

//     const csvContent = [headers.join(","), exampleRow.join(",")].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "products-template.csv";
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   // const parseCSV = (text: string): CSVProduct[] => {
//   //   const lines = text.trim().split("\n");
//   //   if (lines.length < 2) {
//   //     throw new Error("CSV file must contain headers and at least one product");
//   //   }

//   //   const headers = lines[0].split(",").map((h) => h.trim());
//   //   const expectedHeaders = [
//   //     "name",
//   //     "price",
//   //     "original_price",
//   //     "image",
//   //     "category",
//   //     "skin_types",
//   //     "description",
//   //     "is_new",
//   //     "is_bestseller",
//   //   ];

//   //   const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h));
//   //   if (missingHeaders.length > 0) {
//   //     throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`);
//   //   }

//   //   const products: CSVProduct[] = [];
//   //   for (let i = 1; i < lines.length; i++) {
//   //     const values = lines[i].split(",").map((v) => v.trim());
//   //     if (values.length !== headers.length) {
//   //       throw new Error(`Row ${i + 1} has incorrect number of columns`);
//   //     }

//   //     const product: CSVProduct = {} as CSVProduct;
//   //     headers.forEach((header, index) => {
//   //       product[header as keyof CSVProduct] = values[index];
//   //     });

//   //     if (!product.name || !product.price || !product.category) {
//   //       throw new Error(
//   //         `Row ${i + 1} is missing required fields (name, price, category)`
//   //       );
//   //     }

//   //     products.push(product);
//   //   }

//   //   return products;
//   // };
//   const parseCSV = (text: string): CSVProduct[] => {
//     const { data, errors } = Papa.parse<CSVProduct>(text, {
//       header: true,
//       skipEmptyLines: true,
//     });

//     if (errors.length > 0) {
//       console.error("CSV parse errors:", errors);
//       throw new Error(
//         `CSV parse error on row ${errors[0].row}: ${errors[0].message}`
//       );
//     }

//     // Validate expected headers
//     const expectedHeaders = [
//       "name",
//       "price",
//       "original_price",
//       "image",
//       "category",
//       "skin_types",
//       "description",
//       "is_new",
//       "is_bestseller",
//     ];
//     const actualHeaders = Object.keys(data[0] || {});
//     const missingHeaders = expectedHeaders.filter(
//       (h) => !actualHeaders.includes(h)
//     );
//     if (missingHeaders.length > 0) {
//       throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`);
//     }

//     return data;
//   };

//   const validateProducts = (
//     products: CSVProduct[]
//   ): { valid: boolean; errors: string[] } => {
//     const errors: string[] = [];

//     products.forEach((product, index) => {
//       if (isNaN(Number(product.price))) {
//         errors.push(`Row ${index + 2}: Invalid price "${product.price}"`);
//       }
//       if (product.original_price && isNaN(Number(product.original_price))) {
//         errors.push(
//           `Row ${index + 2}: Invalid original price "${product.original_price}"`
//         );
//       }
//       if (!["true", "false"].includes(product.is_new.toLowerCase())) {
//         errors.push(`Row ${index + 2}: is_new must be "true" or "false"`);
//       }
//       if (!["true", "false"].includes(product.is_bestseller.toLowerCase())) {
//         errors.push(`Row ${index + 2}: isBestseller must be "true" or "false"`);
//       }
//     });

//     return { valid: errors.length === 0, errors };
//   };

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setIsLoading(true);
//     setStatus({ type: null, message: "" });

//     try {
//       const text = await file.text();
//       const products = parseCSV(text);
//       const validation = validateProducts(products);
//       const formattedProducts = products.map((p) => ({
//         name: p.name,
//         price: Number(p.price),
//         original_price: p.original_price ? Number(p.original_price) : null,
//         image: p.image,
//         category: p.category,
//         skin_types: p.skin_types.split(",").map((s) => s.trim()),
//         description: p.description,
//         is_new: p.is_new.toLowerCase() === "true",
//         is_bestseller: p.is_bestseller.toLowerCase() === "true",
//       }));

//       if (!validation.valid) {
//         setStatus({
//           type: "error",
//           message: `Validation errors:\n${validation.errors.join("\n")}`,
//         });
//         setIsLoading(false);
//         return;
//       }

//       const response = await fetch("/api/products/bulk", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ products: formattedProducts }),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.error || "Failed to upload products");
//       }

//       console.log("✅ Supabase upload success:", result);

//       setUploadedCount(formattedProducts.length);
//       setStatus({
//         type: "success",
//         message: `Successfully uploaded ${formattedProducts.length} product(s)!`,
//       });

//       // Reset file input
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }

//       setTimeout(() => setStatus({ type: null, message: "" }), 3000);
//     } catch (error) {
//       setStatus({
//         type: "error",
//         message:
//           error instanceof Error ? error.message : "Failed to process CSV file",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Status Messages */}
//       {status.type && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -10 }}
//           className={`flex items-start gap-3 p-4 rounded-lg whitespace-pre-wrap ${
//             status.type === "success"
//               ? "bg-green-50 text-green-900"
//               : "bg-red-50 text-red-900"
//           }`}
//         >
//           {status.type === "success" ? (
//             <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
//           ) : (
//             <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
//           )}
//           <span className="text-sm">{status.message}</span>
//         </motion.div>
//       )}

//       {/* Instructions */}
//       <Card>
//         <CardContent className="p-6">
//           <h3 className="font-medium text-foreground mb-3">
//             {"CSV Format Instructions"}
//           </h3>
//           <ul className="space-y-2 text-sm text-muted-foreground">
//             <li>{"• Download the template to see the correct format"}</li>
//             <li>
//               {
//                 "• Required columns: name, price, category, image, skinType, description, isNew, isBestseller"
//               }
//             </li>
//             <li>
//               {
//                 "• Skin types should be comma-separated (e.g., 'All Skin Types,Dry Skin')"
//               }
//             </li>
//             <li>{"• isNew and isBestseller must be 'true' or 'false'"}</li>
//             <li>
//               {"• originalPrice is optional (leave blank if no discount)"}
//             </li>
//           </ul>
//         </CardContent>
//       </Card>

//       {/* Download Template */}
//       <Button
//         onClick={downloadTemplate}
//         variant="outline"
//         className="w-full bg-transparent"
//       >
//         <Download className="h-4 w-4 mr-2" />
//         {"Download CSV Template"}
//       </Button>

//       {/* File Upload */}
//       <Card>
//         <CardContent className="p-6">
//           <div className="border-2 border-dashed border-input rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept=".csv"
//               onChange={handleFileUpload}
//               disabled={isLoading}
//               className="hidden"
//             />
//             <button
//               type="button"
//               onClick={() => fileInputRef.current?.click()}
//               disabled={isLoading}
//               className="w-full"
//             >
//               <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
//               <p className="font-medium text-foreground mb-1">
//                 {isLoading ? "Processing..." : "Click to upload CSV file"}
//               </p>
//               <p className="text-sm text-muted-foreground">
//                 {"or drag and drop"}
//               </p>
//             </button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Upload Stats */}
//       {uploadedCount > 0 && (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center"
//         >
//           <p className="text-sm text-blue-900">
//             {"Total products uploaded in this session: "}
//             <span className="font-medium">{uploadedCount}</span>
//           </p>
//         </motion.div>
//       )}
//     </div>
//   );
// }

"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Upload,
  Download,
  FolderOpen,
} from "lucide-react";
import JSZip from "jszip";
import Papa from "papaparse";
import { supabase } from "@/utils/supabase/client";

interface CSVProduct {
  name: string;
  price: string;
  original_price: string;
  image_filenames: string; // Comma-separated filenames
  category: string;
  skin_types: string;
  description: string;
  is_new: string;
  is_bestseller: string;
  ingredients?: string;
  benefits?: string;
  how_to_use?: string;
  rating?: string;
  review_count?: string;
}

interface ProcessedProduct {
  name: string;
  price: number;
  original_price: number | null;
  images: string[]; // Will contain uploaded URLs
  category: string;
  skin_types: string[];
  description: string;
  is_new: boolean;
  is_bestseller: boolean;
  ingredients: string[];
  benefits: string[];
  how_to_use: string;
  rating: number;
  review_count: number;
}

export function BulkProductUpload() {
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const headers = [
      "name",
      "price",
      "original_price",
      "image_filenames",
      "category",
      "skin_types",
      "description",
      "is_new",
      "is_bestseller",
      "ingredients",
      "benefits",
      "how_to_use",
      "rating",
      "review_count",
    ];

    const exampleRow = [
      "Hydrating Serum",
      "65",
      "",
      '"serum1.jpg,serum2.jpg,serum3.jpg"',
      "Serums",
      '"All Skin Types,Dry Skin"',
      "Intensive hydration serum with hyaluronic acid",
      "true",
      "false",
      '"Hyaluronic Acid,Vitamin B5,Panthenol"',
      '"Deep hydration,Plumps skin,Reduces fine lines"',
      "Apply 2-3 drops to clean face and neck morning and evening",
      "4.8",
      "127",
    ];

    const csvContent = [headers.join(","), exampleRow.join(",")].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products-template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Upload single image to Supabase
  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()
      .toString(36)
      .substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("products").getPublicUrl(filePath);

    return publicUrl;
  };

  // Process ZIP file containing CSV + images
  const processZipFile = async (file: File): Promise<ProcessedProduct[]> => {
    const zip = new JSZip();
    const zipContents = await zip.loadAsync(file);

    // Find CSV file
    const csvFile = Object.keys(zipContents.files).find(
      (name) => name.endsWith(".csv") || name.endsWith(".CSV")
    );

    if (!csvFile) {
      throw new Error("No CSV file found in the ZIP archive");
    }

    // Parse CSV
    const csvContent = await zipContents.files[csvFile].async("text");
    const { data: products } = Papa.parse<CSVProduct>(csvContent, {
      header: true,
      skipEmptyLines: true,
    });

    if (!products.length) {
      throw new Error("No products found in CSV file");
    }

    // Process each product and upload images
    const processedProducts: ProcessedProduct[] = [];

    for (const product of products) {
      const imageFilenames = product.image_filenames
        .split(",")
        .map((f) => f.trim());
      const uploadedImageUrls: string[] = [];

      // Upload each image for this product
      for (const filename of imageFilenames) {
        const imageFile = zipContents.files[filename];
        if (!imageFile) {
          console.warn(`Image file not found in ZIP: ${filename}`);
          continue;
        }

        const blob = await imageFile.async("blob");
        const file = new File([blob], filename, { type: "image/jpeg" });

        try {
          const imageUrl = await uploadImageToSupabase(file);
          uploadedImageUrls.push(imageUrl);
        } catch (error) {
          console.error(`Failed to upload image ${filename}:`, error);
        }
      }

      if (uploadedImageUrls.length === 0) {
        throw new Error(`No images uploaded for product: ${product.name}`);
      }

      processedProducts.push({
        name: product.name,
        price: Number(product.price),
        original_price: product.original_price
          ? Number(product.original_price)
          : null,
        images: uploadedImageUrls,
        category: product.category,
        skin_types: product.skin_types.split(",").map((s) => s.trim()),
        description: product.description,
        is_new: product.is_new.toLowerCase() === "true",
        is_bestseller: product.is_bestseller.toLowerCase() === "true",
        ingredients: product.ingredients
          ? product.ingredients.split(",").map((s) => s.trim())
          : [],
        benefits: product.benefits
          ? product.benefits.split(",").map((s) => s.trim())
          : [],
        how_to_use: product.how_to_use || "",
        rating: product.rating ? Number(product.rating) : 0,
        review_count: product.review_count ? Number(product.review_count) : 0,
      });
    }

    return processedProducts;
  };

  // Process regular CSV file (image URLs approach)
  const processCSVFile = async (file: File): Promise<ProcessedProduct[]> => {
    const text = await file.text();
    const { data: products } = Papa.parse<CSVProduct>(text, {
      header: true,
      skipEmptyLines: true,
    });

    return products.map((product) => ({
      name: product.name,
      price: Number(product.price),
      original_price: product.original_price
        ? Number(product.original_price)
        : null,
      images: product.image_filenames.split(",").map((f) => f.trim()), // These would be URLs
      category: product.category,
      skin_types: product.skin_types.split(",").map((s) => s.trim()),
      description: product.description,
      is_new: product.is_new.toLowerCase() === "true",
      is_bestseller: product.is_bestseller.toLowerCase() === "true",
      ingredients: product.ingredients
        ? product.ingredients.split(",").map((s) => s.trim())
        : [],
      benefits: product.benefits
        ? product.benefits.split(",").map((s) => s.trim())
        : [],
      how_to_use: product.how_to_use || "",
      rating: product.rating ? Number(product.rating) : 0,
      review_count: product.review_count ? Number(product.review_count) : 0,
    }));
  };

  const validateProducts = (
    products: ProcessedProduct[]
  ): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    products.forEach((product, index) => {
      if (!product.name?.trim()) {
        errors.push(`Row ${index + 2}: Product name is required`);
      }
      if (!product.price || product.price <= 0) {
        errors.push(`Row ${index + 2}: Valid price is required`);
      }
      if (!product.category?.trim()) {
        errors.push(`Row ${index + 2}: Category is required`);
      }
      if (product.images.length === 0) {
        errors.push(`Row ${index + 2}: At least one image is required`);
      }
      if (!product.description?.trim()) {
        errors.push(`Row ${index + 2}: Description is required`);
      }
    });

    return { valid: errors.length === 0, errors };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setStatus({ type: null, message: "" });

    try {
      let processedProducts: ProcessedProduct[];

      if (file.name.endsWith(".zip")) {
        // Process ZIP file
        processedProducts = await processZipFile(file);
      } else if (file.name.endsWith(".csv")) {
        // Process CSV file (with image URLs)
        processedProducts = await processCSVFile(file);
      } else {
        throw new Error(
          "Unsupported file format. Please upload a ZIP or CSV file."
        );
      }

      const validation = validateProducts(processedProducts);

      if (!validation.valid) {
        setStatus({
          type: "error",
          message: `Validation errors:\n${validation.errors.join("\n")}`,
        });
        setIsLoading(false);
        return;
      }

      // Upload products to your API
      const response = await fetch("/api/products/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: processedProducts }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload products");
      }

      setUploadedCount(processedProducts.length);
      setStatus({
        type: "success",
        message: `Successfully uploaded ${processedProducts.length} product(s)!`,
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setTimeout(() => setStatus({ type: null, message: "" }), 5000);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to process upload file",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      {status.type && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`flex items-start gap-3 p-4 rounded-lg whitespace-pre-wrap ${
            status.type === "success"
              ? "bg-green-50 text-green-900"
              : "bg-red-50 text-red-900"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          )}
          <span className="text-sm">{status.message}</span>
        </motion.div>
      )}

      {/* Instructions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium text-foreground mb-3">
            Bulk Upload Instructions
          </h3>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm mb-2">
                Option 1: ZIP File (Recommended)
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Create a ZIP file containing:</li>
                <li>• A CSV file with product data</li>
                <li>• All product images referenced in the CSV</li>
                <li>• Images will be automatically uploaded to Supabase</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">
                Option 2: CSV File Only
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Use image URLs in the CSV file</li>
                <li>• URLs must be publicly accessible</li>
                <li>• Separate multiple images with commas</li>
              </ul>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Required columns: name, price, category, image_filenames,
              skin_types, description, is_new, is_bestseller
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Template */}
      <div className="flex gap-3">
        <Button onClick={downloadTemplate} variant="outline" className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download CSV Template
        </Button>
      </div>

      {/* File Upload */}
      <Card>
        <CardContent className="p-6">
          <div className="border-2 border-dashed border-input rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.zip"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="w-full"
            >
              <FolderOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="font-medium text-foreground mb-1">
                {isLoading ? "Processing..." : "Upload ZIP or CSV File"}
              </p>
              <p className="text-sm text-muted-foreground">
                Supports .zip (with images) or .csv (with URLs)
              </p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Stats */}
      {uploadedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center"
        >
          <p className="text-sm text-blue-900">
            Total products uploaded in this session:{" "}
            <span className="font-medium">{uploadedCount}</span>
          </p>
        </motion.div>
      )}
    </div>
  );
}
