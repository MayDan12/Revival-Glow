// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import Link from "next/link";
// import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
// import { useCart } from "@/contexts/cart-context";

// interface ProductGridProps {
//   products: any[];
//   loading: boolean;
//   error: string | null;
//   currentPage: number;
//   totalPages: number;
//   totalProducts: number;
//   itemsPerPage: number;
//   onPageChange: (page: number) => void;
//   onItemsPerPageChange: (items: number) => void;
// }

// export function ProductGrid({
//   products,
//   loading,
//   error,
//   currentPage,
//   totalPages,
//   totalProducts,
//   itemsPerPage,
//   onPageChange,
//   onItemsPerPageChange,
// }: ProductGridProps) {
//   const [favorites, setFavorites] = useState<number[]>([]);
//   const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
//   const { dispatch } = useCart();

//   const addToCart = (product: any) => {
//     const quantity = quantities[product.id] || 1;

//     dispatch({
//       type: "ADD_ITEM",
//       payload: {
//         id: product.id,
//         name: product.name,
//         price: product.price,
//         image: product.images ? product.images[0] : product.image,
//         quantity: quantity,
//       },
//     });

//     setQuantities((prev) => ({
//       ...prev,
//       [product.id]: 1,
//     }));
//   };

//   const updateQuantity = (productId: number, newQuantity: number) => {
//     if (newQuantity < 1) return;
//     setQuantities((prev) => ({
//       ...prev,
//       [productId]: newQuantity,
//     }));
//   };

//   const toggleFavorite = (productId: number) => {
//     setFavorites((prev) =>
//       prev.includes(productId)
//         ? prev.filter((id) => id !== productId)
//         : [...prev, productId]
//     );
//   };

//   // Generate page numbers to display
//   const getPageNumbers = () => {
//     const pages: (number | string)[] = [];
//     const maxVisible = 5;

//     if (totalPages <= maxVisible) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       if (currentPage <= 3) {
//         for (let i = 1; i <= 4; i++) pages.push(i);
//         pages.push("...");
//         pages.push(totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         pages.push(1);
//         pages.push("...");
//         for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
//       } else {
//         pages.push(1);
//         pages.push("...");
//         pages.push(currentPage - 1);
//         pages.push(currentPage);
//         pages.push(currentPage + 1);
//         pages.push("...");
//         pages.push(totalPages);
//       }
//     }

//     return pages;
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-12">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Loading products...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-red-600 mb-4">Error: {error}</p>
//         <Button variant="outline" onClick={() => window.location.reload()}>
//           Try Again
//         </Button>
//       </div>
//     );
//   }

//   const startItem = (currentPage - 1) * itemsPerPage + 1;
//   const endItem = Math.min(currentPage * itemsPerPage, totalProducts);

//   return (
//     <div className="space-y-4">
//       {/* Header with results count and items per page selector */}
//       <div className="flex items-center justify-between">
//         <p className="text-sm text-muted-foreground">
//           Showing {startItem}-{endItem} of {totalProducts} products
//         </p>
//         <div className="flex items-center gap-2">
//           <span className="text-sm text-muted-foreground">Show:</span>
//           <Select
//             value={itemsPerPage.toString()}
//             onValueChange={(value) => onItemsPerPageChange(Number(value))}
//           >
//             <SelectTrigger className="w-[80px]">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="12">12</SelectItem>
//               <SelectItem value="24">24</SelectItem>
//               <SelectItem value="36">36</SelectItem>
//               <SelectItem value="48">48</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Products Grid */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {products.map((product) => (
//           <Card
//             key={product.id}
//             className="group py-0 cursor-pointer border-0 shadow-sm hover:shadow-md transition-all duration-300"
//           >
//             <CardContent className="p-0">
//               <div className="relative aspect-square overflow-hidden rounded-t-lg">
//                 <img
//                   src={product.images ? product.images[0] : "/placeholder.svg"}
//                   alt={product.name}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                 />

//                 <div className="absolute top-3 left-3 flex flex-col gap-1">
//                   {product.is_new && (
//                     <Badge variant="secondary" className="text-xs">
//                       New
//                     </Badge>
//                   )}
//                   {product.is_bestseller && (
//                     <Badge variant="default" className="text-xs">
//                       Bestseller
//                     </Badge>
//                   )}
//                 </div>

//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="absolute top-3 right-3 h-7 w-7 p-0 bg-background/80 hover:bg-background"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     toggleFavorite(product.id);
//                   }}
//                 >
//                   <Heart
//                     className={`h-4 w-4 ${
//                       favorites.includes(product.id)
//                         ? "fill-primary text-primary"
//                         : "text-muted-foreground"
//                     }`}
//                   />
//                 </Button>

//                 <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
//                   <Button
//                     size="sm"
//                     className="w-full"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       addToCart(product);
//                     }}
//                   >
//                     <ShoppingCart className="h-4 w-4 mr-2" />
//                     Add to Cart
//                   </Button>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <Link href={`/products/${product.id}`}>
//                   <h3 className="md:text-lg font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
//                     {product.name}
//                   </h3>
//                 </Link>

//                 <p className="text-muted-foreground text-sm mb-3 leading-relaxed line-clamp-2">
//                   {product.description}
//                 </p>

//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <span className="md:text-lg font-medium text-foreground">
//                       ${product.price}
//                     </span>
//                     {product.original_price && (
//                       <span className="text-sm text-muted-foreground line-through">
//                         ${product.original_price}
//                       </span>
//                     )}
//                   </div>

//                   <Badge variant="outline" className="text-xs">
//                     {product.category}
//                   </Badge>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* No Results */}
//       {products.length === 0 && (
//         <div className="text-center py-12">
//           <p className="text-muted-foreground mb-4">
//             No products found matching your filters.
//           </p>
//           <Button variant="outline" onClick={() => window.location.reload()}>
//             Clear Filters
//           </Button>
//         </div>
//       )}

//       {/* Pagination Controls */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-center gap-2 mt-8">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => onPageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             <ChevronLeft className="h-4 w-4" />
//             Previous
//           </Button>

//           <div className="flex items-center gap-1">
//             {getPageNumbers().map((page, index) => (
//               <div key={index}>
//                 {page === "..." ? (
//                   <span className="px-3 py-2 text-muted-foreground">...</span>
//                 ) : (
//                   <Button
//                     variant={currentPage === page ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => onPageChange(page as number)}
//                     className="min-w-[40px]"
//                   >
//                     {page}
//                   </Button>
//                 )}
//               </div>
//             ))}
//           </div>

//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => onPageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           >
//             Next
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/contexts/cart-context";

interface ProductGridProps {
  products: any[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export function ProductGrid({
  products,
  loading,
  error,
  currentPage,
  totalPages,
  totalProducts,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: ProductGridProps) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const { dispatch } = useCart();

  const addToCart = (product: any) => {
    const quantity = quantities[product.id] || 1;

    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images ? product.images[0] : product.image,
        quantity: quantity,
      },
    });

    setQuantities((prev) => ({
      ...prev,
      [product.id]: 1,
    }));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
  };

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalProducts);

  return (
    <div className="space-y-4">
      {/* Header with results count and items per page selector */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {startItem}-{endItem} of {totalProducts} products
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="36">36</SelectItem>
              <SelectItem value="48">48</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="group py-0 cursor-pointer border-0 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <CardContent className="p-0">
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <img
                  src={product.images ? product.images[0] : "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {product.is_new && (
                    <Badge variant="secondary" className="text-xs">
                      New
                    </Badge>
                  )}
                  {product.is_bestseller && (
                    <Badge variant="default" className="text-xs">
                      Bestseller
                    </Badge>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-3 right-3 h-7 w-7 p-0 bg-background/80 hover:bg-background"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(product.id);
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      favorites.includes(product.id)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </Button>

                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <Link href={`/products/${product.id}`}>
                  <h3 className="md:text-lg font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-muted-foreground text-sm mb-3 leading-relaxed line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="md:text-lg font-medium text-foreground">
                      ${product.price}
                    </span>
                    {product.original_price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.original_price}
                      </span>
                    )}
                  </div>

                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No products found matching your filters.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <span className="px-3 py-2 text-muted-foreground">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
