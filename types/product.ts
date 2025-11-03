// Base Product Type (matching your JavaScript object)
export type Product = {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  category: string;
  skinType: string[];
  description: string;
  isNew: boolean;
  isBestseller: boolean;
  rating: number;
  reviewCount: number;
  ingredients: string[];
  benefits: string[];
  howToUse: string;
  stock_quantity: number;
};

// Database Product Type (matching your PostgreSQL schema)
export type DatabaseProduct = {
  id: string; // UUID
  name: string;
  price: number; // numeric(10,2)
  original_price: number | null; // numeric(10,2)
  image: string | null; // Single image instead of array
  category: string | null;
  skin_types: string[]; // Array of skin types
  description: string | null;
  is_new: boolean;
  is_bestseller: boolean;
  seller_id: string; // UUID
  created_at: Date;
};

// Extended Database Product (with all fields from both)
type CompleteDatabaseProduct = {
  id: string;
  name: string;
  price: number;
};
