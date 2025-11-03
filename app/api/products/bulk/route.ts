import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { products } = body;

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "No products provided" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const formatted = products.map((p) => ({
      name: p.name,
      price: p.price,
      original_price: p.original_price ?? null,
      image: p.image,
      category: p.category,
      skin_types: p.skin_types,
      description: p.description,
      is_new: p.isNew,
      is_bestseller: p.isBestseller,
      seller_id: session.user.id,
    }));

    const { data, error } = await supabase.from("products").insert(formatted);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `${formatted.length} products added successfully!`,
      data,
    });
  } catch (err: any) {
    console.error("❌ Bulk upload error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
