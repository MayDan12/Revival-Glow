export const products = [
  {
    id: 1,
    name: "Gentle Cleansing Oil",
    price: 48,
    originalPrice: null,
    images: [
      "/minimalist-skincare-cleansing-oil-bottle.jpg",
      "/placeholder.svg?key=oil2",
      "/placeholder.svg?key=oil3",
    ],
    category: "Cleansers",
    skinType: ["All Skin Types", "Dry Skin"],
    description:
      "A luxurious cleansing oil that removes makeup and impurities while nourishing your skin with natural botanical oils.",
    isNew: false,
    isBestseller: true,
    rating: 4.8,
    reviewCount: 127,
    ingredients: [
      "Jojoba Oil: Deeply moisturizes without clogging pores",
      "Sunflower Seed Oil: Rich in vitamin E and antioxidants",
      "Chamomile Extract: Soothes and calms irritated skin",
      "Vitamin E: Protects against environmental damage",
    ],
    benefits: [
      "Gently removes makeup and impurities",
      "Nourishes and hydrates skin",
      "Suitable for all skin types including sensitive",
      "Leaves skin soft and supple",
      "Non-comedogenic formula",
    ],
    howToUse:
      "Apply 2-3 pumps to dry skin and gently massage in circular motions. Add a small amount of warm water to emulsify, then rinse thoroughly. Use morning and evening as the first step in your skincare routine.",
  },
  {
    id: 2,
    name: "Hydrating Serum",
    price: 65,
    originalPrice: null,
    images: [
      "/elegant-skincare-serum-bottle-with-dropper.jpg",
      "/placeholder.svg?key=serum2",
      "/placeholder.svg?key=serum3",
    ],
    category: "Serums",
    skinType: ["All Skin Types", "Dry Skin", "Mature"],
    description:
      "Intensive hydration serum with hyaluronic acid and botanical extracts that plumps and moisturizes for visibly smoother skin.",
    isNew: true,
    isBestseller: false,
    rating: 4.9,
    reviewCount: 89,
    ingredients: [
      "Hyaluronic Acid: Holds up to 1000x its weight in water",
      "Niacinamide: Improves skin texture and minimizes pores",
      "Aloe Vera Extract: Soothes and hydrates",
      "Peptides: Support collagen production",
    ],
    benefits: [
      "Provides intense hydration for up to 24 hours",
      "Plumps fine lines and wrinkles",
      "Improves skin texture and radiance",
      "Lightweight, fast-absorbing formula",
      "Suitable for layering with other products",
    ],
    howToUse:
      "Apply 2-3 drops to clean skin morning and evening. Gently pat into skin until fully absorbed. Follow with moisturizer. Can be used alone or layered under other serums.",
  },
  {
    id: 3,
    name: "Nourishing Night Cream",
    price: 72,
    originalPrice: null,
    images: [
      "/luxury-skincare-cream-jar-minimalist-design.jpg",
      "/placeholder.svg?key=cream2",
      "/placeholder.svg?key=cream3",
    ],
    category: "Moisturizers",
    skinType: ["Dry Skin", "Mature", "All Skin Types"],
    description:
      "Rich night cream that repairs and rejuvenates while you sleep, formulated with powerful anti-aging ingredients and nourishing botanicals.",
    isNew: false,
    isBestseller: true,
    rating: 4.7,
    reviewCount: 156,
    ingredients: [
      "Retinyl Palmitate: Gentle vitamin A derivative for renewal",
      "Shea Butter: Deeply nourishing and moisturizing",
      "Ceramides: Restore and maintain skin barrier",
      "Rosehip Oil: Rich in vitamins and essential fatty acids",
    ],
    benefits: [
      "Repairs and regenerates skin overnight",
      "Reduces appearance of fine lines and wrinkles",
      "Deeply moisturizes and nourishes",
      "Improves skin firmness and elasticity",
      "Wakes up to smoother, more radiant skin",
    ],
    howToUse:
      "Apply generously to clean face and neck every evening. Gently massage in upward motions until fully absorbed. Allow to work overnight for maximum benefits. Use sunscreen during the day when using this product.",
  },
  {
    id: 4,
    name: "Revitalizing Eye Cream",
    price: 58,
    originalPrice: null,
    images: [
      "/luxury-skincare-cream-jar-minimalist-design.jpg",
      "/placeholder.svg?key=eyecream2",
      "/placeholder.svg?key=eyecream3",
    ],
    category: "Eye Care",
    skinType: ["All Skin Types", "Dry Skin", "Mature"],
    description:
      "Luxurious eye cream that brightens, firms, and hydrates the delicate eye area, reducing the appearance of dark circles and puffiness.",
    isNew: true,
    isBestseller: false,
    rating: 4.6,
    reviewCount: 67,
    ingredients: [
      "Caffeine: Reduces puffiness and dark circles",
      "Peptides: Support collagen production",
      "Hyaluronic Acid: Provides intense hydration",
      "Vitamin C: Brightens and evens skin tone",
    ],
    benefits: [
      "Brightens and revitalizes tired eyes",
      "Reduces the appearance of dark circles",
      "Hydrates and plumps the skin",
      "Improves skin elasticity and firmness",
      "Lightweight, fast-absorbing formula",
    ],
    howToUse:
      "Apply a small amount to the under-eye area using your ring finger. Gently tap until fully absorbed. Use morning and evening for best results.",
  },
];

export function getProductById(id: number) {
  return products.find((product) => product.id === id);
}
