// app/products/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { ProductGallery } from "@/components/product-gallery";
import { ProductDetails } from "@/components/product-details";
import { useSingleProduct } from "@/hooks/useSingleProduct";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const { product, loading, error, refetch } = useSingleProduct(productId);

  // Loading state
  if (loading) {
    return (
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading product...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Error Loading Product
              </h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => window.history.back()}>
                  Go Back
                </Button>
                <Button onClick={() => refetch()}>Try Again</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Not found state
  if (!product) {
    return (
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Product Not Found
              </h2>
              <p className="text-muted-foreground mb-6">
                The product you're looking for doesn't exist or has been
                removed.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => window.history.back()}>
                  Go Back
                </Button>
                <Link href="/products">
                  <Button>Browse Products</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-muted-foreground">
            <li>
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/products"
                className="hover:text-foreground transition-colors"
              >
                Products
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <div>
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Product Details */}
          <div>
            <ProductDetails product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}
