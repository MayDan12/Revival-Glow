// // "use client";

// // import { useState } from "react";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Checkbox } from "@/components/ui/checkbox";
// // import { Label } from "@/components/ui/label";
// // import { Slider } from "@/components/ui/slider";

// // interface ProductFiltersProps {
// //   onFiltersChange: (filters: any) => void;
// // }

// // export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
// //   const [priceRange, setPriceRange] = useState([0, 200]);
// //   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
// //   const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);

// //   const categories = [
// //     "Cleansers",
// //     "Serums",
// //     "Moisturizers",
// //     "Masks",
// //     "Sunscreen",
// //     "Eye Care",
// //   ];

// //   const skinTypes = [
// //     "All Skin Types",
// //     "Dry Skin",
// //     "Oily Skin",
// //     "Combination",
// //     "Sensitive",
// //     "Mature",
// //   ];

// //   const handleCategoryChange = (category: string, checked: boolean) => {
// //     const updated = checked
// //       ? [...selectedCategories, category]
// //       : selectedCategories.filter((c) => c !== category);
// //     setSelectedCategories(updated);
// //     onFiltersChange({
// //       categories: updated,
// //       skinTypes: selectedSkinTypes,
// //       priceRange,
// //     });
// //   };

// //   const handleSkinTypeChange = (skinType: string, checked: boolean) => {
// //     const updated = checked
// //       ? [...selectedSkinTypes, skinType]
// //       : selectedSkinTypes.filter((s) => s !== skinType);
// //     setSelectedSkinTypes(updated);
// //     onFiltersChange({
// //       categories: selectedCategories,
// //       skinTypes: updated,
// //       priceRange,
// //     });
// //   };

// //   const handlePriceChange = (value: number[]) => {
// //     setPriceRange(value);
// //     onFiltersChange({
// //       categories: selectedCategories,
// //       skinTypes: selectedSkinTypes,
// //       priceRange: value,
// //     });
// //   };

// //   const clearFilters = () => {
// //     setPriceRange([0, 200]);
// //     setSelectedCategories([]);
// //     setSelectedSkinTypes([]);
// //     onFiltersChange({ categories: [], skinTypes: [], priceRange: [0, 200] });
// //   };

// //   return (
// //     <Card className="sticky top-24">
// //       <CardContent className="p-6">
// //         <div className="flex items-center justify-between mb-6">
// //           <h3 className="font-medium text-foreground">{"Filters"}</h3>
// //           <Button variant="ghost" size="sm" onClick={clearFilters}>
// //             {"Clear All"}
// //           </Button>
// //         </div>

// //         {/* Price Range */}
// //         <div className="mb-8">
// //           <Label className="text-sm font-medium mb-4 block">
// //             {"Price Range: $"}
// //             {priceRange[0]} - {"$"}
// //             {priceRange[1]}
// //           </Label>
// //           <Slider
// //             value={priceRange}
// //             onValueChange={handlePriceChange}
// //             max={200}
// //             min={0}
// //             step={5}
// //             className="w-full"
// //           />
// //         </div>

// //         {/* Categories */}
// //         <div className="mb-8">
// //           <Label className="text-sm font-medium mb-4 block">{"Category"}</Label>
// //           <div className="space-y-3">
// //             {categories.map((category) => (
// //               <div key={category} className="flex items-center space-x-2">
// //                 <Checkbox
// //                   id={category}
// //                   checked={selectedCategories.includes(category)}
// //                   onCheckedChange={(checked) =>
// //                     handleCategoryChange(category, checked as boolean)
// //                   }
// //                 />
// //                 <Label
// //                   htmlFor={category}
// //                   className="text-sm text-muted-foreground cursor-pointer"
// //                 >
// //                   {category}
// //                 </Label>
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Skin Types */}
// //         <div>
// //           <Label className="text-sm font-medium mb-4 block">
// //             {"Skin Type"}
// //           </Label>
// //           <div className="space-y-3">
// //             {skinTypes.map((skinType) => (
// //               <div key={skinType} className="flex items-center space-x-2">
// //                 <Checkbox
// //                   id={skinType}
// //                   checked={selectedSkinTypes.includes(skinType)}
// //                   onCheckedChange={(checked) =>
// //                     handleSkinTypeChange(skinType, checked as boolean)
// //                   }
// //                 />
// //                 <Label
// //                   htmlFor={skinType}
// //                   className="text-sm text-muted-foreground cursor-pointer"
// //                 >
// //                   {skinType}
// //                 </Label>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // }
// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider";

// interface ProductFiltersProps {
//   onFiltersChange: (filters: any) => void;
//   initialFilters?: any;
// }

// export function ProductFilters({
//   onFiltersChange,
//   initialFilters,
// }: ProductFiltersProps) {
//   // Initialize state with values from parent or defaults
//   const [priceRange, setPriceRange] = useState(
//     initialFilters?.priceRange || [0, 200]
//   );
//   const [selectedCategories, setSelectedCategories] = useState<string[]>(
//     initialFilters?.categories || []
//   );
//   const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>(
//     initialFilters?.skinTypes || []
//   );

//   const categories = [
//     "Cleansers",
//     "Serums",
//     "Moisturizers",
//     "Masks",
//     "Sunscreen",
//     "Eye Care",
//   ];

//   const skinTypes = [
//     "All Skin Types",
//     "Dry Skin",
//     "Oily Skin",
//     "Combination",
//     "Sensitive",
//     "Mature",
//   ];

//   // Sync with parent when initialFilters change
//   useEffect(() => {
//     setPriceRange(initialFilters?.priceRange || [0, 200]);
//     setSelectedCategories(initialFilters?.categories || []);
//     setSelectedSkinTypes(initialFilters?.skinTypes || []);
//   }, [initialFilters]);

//   // Emit filter changes to parent
//   const emitFilters = (updates: any) => {
//     onFiltersChange({
//       ...initialFilters, // Keep other filter properties (isNew, isBestseller, searchQuery)
//       categories:
//         updates.categories !== undefined
//           ? updates.categories
//           : selectedCategories,
//       skinTypes:
//         updates.skinTypes !== undefined ? updates.skinTypes : selectedSkinTypes,
//       priceRange:
//         updates.priceRange !== undefined ? updates.priceRange : priceRange,
//     });
//   };

//   const handleCategoryChange = (category: string, checked: boolean) => {
//     const updated = checked
//       ? [...selectedCategories, category]
//       : selectedCategories.filter((c) => c !== category);
//     setSelectedCategories(updated);
//     emitFilters({ categories: updated });
//   };

//   const handleSkinTypeChange = (skinType: string, checked: boolean) => {
//     const updated = checked
//       ? [...selectedSkinTypes, skinType]
//       : selectedSkinTypes.filter((s) => s !== skinType);
//     setSelectedSkinTypes(updated);
//     emitFilters({ skinTypes: updated });
//   };

//   const handlePriceChange = (value: number[]) => {
//     setPriceRange(value);
//     emitFilters({ priceRange: value });
//   };

//   const clearFilters = () => {
//     setPriceRange([0, 200]);
//     setSelectedCategories([]);
//     setSelectedSkinTypes([]);
//     emitFilters({
//       categories: [],
//       skinTypes: [],
//       priceRange: [0, 200],
//     });
//   };

//   return (
//     <Card className="sticky top-24">
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="font-medium text-foreground">Filters</h3>
//           <Button variant="ghost" size="sm" onClick={clearFilters}>
//             Clear All
//           </Button>
//         </div>

//         {/* Price Range */}
//         <div className="mb-8">
//           <Label className="text-sm font-medium mb-4 block">
//             Price Range: ${priceRange[0]} - ${priceRange[1]}
//           </Label>
//           <Slider
//             value={priceRange}
//             onValueChange={handlePriceChange}
//             max={200}
//             min={0}
//             step={5}
//             className="w-full"
//           />
//         </div>
//         <div className="flex md:flex-col gap-8 md:gap-0">
//           {/* Categories */}
//           <div className="mb-8">
//             <Label className="text-sm font-medium mb-4 block">Category</Label>
//             <div className="space-y-3">
//               {categories.map((category) => (
//                 <div key={category} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`category-${category}`}
//                     checked={selectedCategories.includes(category)}
//                     onCheckedChange={(checked) =>
//                       handleCategoryChange(category, checked as boolean)
//                     }
//                     className="border-primary focus:ring-primary"
//                   />
//                   <Label
//                     htmlFor={`category-${category}`}
//                     className="text-sm text-muted-foreground cursor-pointer"
//                   >
//                     {category}
//                   </Label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Skin Types */}
//           <div>
//             <Label className="text-sm font-medium mb-4 block">Skin Type</Label>
//             <div className="space-y-3">
//               {skinTypes.map((skinType) => (
//                 <div key={skinType} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`skinType-${skinType}`}
//                     checked={selectedSkinTypes.includes(skinType)}
//                     onCheckedChange={(checked) =>
//                       handleSkinTypeChange(skinType, checked as boolean)
//                     }
//                     className="border-primary focus:ring-primary"
//                   />
//                   <Label
//                     htmlFor={`skinType-${skinType}`}
//                     className="text-sm text-muted-foreground cursor-pointer"
//                   >
//                     {skinType}
//                   </Label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface ProductFiltersProps {
  onFiltersChange: (filters: any) => void;
  initialFilters?: any;
}

export function ProductFilters({
  onFiltersChange,
  initialFilters,
}: ProductFiltersProps) {
  // Initialize state with values from parent or defaults
  const [priceRange, setPriceRange] = useState(
    initialFilters?.priceRange || [0, 200]
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters?.categories || []
  );
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>(
    initialFilters?.skinTypes || []
  );

  const categories = [
    "Cleansers",
    "Serums",
    "Moisturizers",
    "Masks",
    "Sunscreen",
    "Eye Care",
  ];

  const skinTypes = [
    "All Skin Types",
    "Dry Skin",
    "Oily Skin",
    "Combination",
    "Sensitive",
    "Mature",
  ];

  // Sync with parent when initialFilters change
  useEffect(() => {
    setPriceRange(initialFilters?.priceRange || [0, 200]);
    setSelectedCategories(initialFilters?.categories || []);
    setSelectedSkinTypes(initialFilters?.skinTypes || []);
  }, [initialFilters]);

  // Emit filter changes to parent
  const emitFilters = (updates: any) => {
    onFiltersChange({
      ...initialFilters, // Keep other filter properties (isNew, isBestseller, searchQuery)
      categories:
        updates.categories !== undefined
          ? updates.categories
          : selectedCategories,
      skinTypes:
        updates.skinTypes !== undefined ? updates.skinTypes : selectedSkinTypes,
      priceRange:
        updates.priceRange !== undefined ? updates.priceRange : priceRange,
    });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updated = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter((c) => c !== category);
    setSelectedCategories(updated);
    emitFilters({ categories: updated });
  };

  const handleSkinTypeChange = (skinType: string, checked: boolean) => {
    const updated = checked
      ? [...selectedSkinTypes, skinType]
      : selectedSkinTypes.filter((s) => s !== skinType);
    setSelectedSkinTypes(updated);
    emitFilters({ skinTypes: updated });
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    emitFilters({ priceRange: value });
  };

  const clearFilters = () => {
    setPriceRange([0, 200]);
    setSelectedCategories([]);
    setSelectedSkinTypes([]);
    emitFilters({
      categories: [],
      skinTypes: [],
      priceRange: [0, 200],
    });
  };

  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-medium text-foreground">Filters</h3>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <Label className="text-sm font-medium mb-4 block">
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </Label>
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            max={200}
            min={0}
            step={5}
            className="w-full"
          />
        </div>
        <div className="flex md:flex-col gap-8 md:gap-0">
          {/* Categories */}
          <div className="mb-8">
            <Label className="text-sm font-medium mb-4 block">Category</Label>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category, checked as boolean)
                    }
                    className="border-primary focus:ring-primary"
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Skin Types */}
          <div>
            <Label className="text-sm font-medium mb-4 block">Skin Type</Label>
            <div className="space-y-3">
              {skinTypes.map((skinType) => (
                <div key={skinType} className="flex items-center space-x-2">
                  <Checkbox
                    id={`skinType-${skinType}`}
                    checked={selectedSkinTypes.includes(skinType)}
                    onCheckedChange={(checked) =>
                      handleSkinTypeChange(skinType, checked as boolean)
                    }
                    className="border-primary focus:ring-primary"
                  />
                  <Label
                    htmlFor={`skinType-${skinType}`}
                    className="text-sm text-muted-foreground cursor-pointer"
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
  );
}
