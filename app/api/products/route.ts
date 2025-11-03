import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
// import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      price,
      originalPrice,
      image,
      category,
      skinType,
      description,
      isNew,
      isBestseller,
    } = body;

    const supabase = await createClient();

    const { data, error } = await supabase.from("products").insert([
      {
        name,
        price,
        original_price: originalPrice,
        image,
        category,
        skin_type: skinType,
        description,
        is_new: isNew,
        is_bestseller: isBestseller,
        seller_id: session.user.id,
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("❌ Error creating product:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
