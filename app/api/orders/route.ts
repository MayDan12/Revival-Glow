import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("orders").select("*");

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// export async function POST(req: Request) {
//   const supabase = await createClient(); // ✅ Add this line

//   const { email, items, total, address } = await req.json();

//   const { error } = await supabase
//     .from("orders")
//     .insert([{ email, items, total, address, status: "pending" }]);

//   if (error)
//     return NextResponse.json({ error: error.message }, { status: 400 });

//   return NextResponse.json({ success: true }, { status: 201 });
// }

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      items,
      totalAmount,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in order." },
        { status: 400 }
      );
    }

    // Create order record
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: `${firstName} ${lastName}`,
          email,
          phone,
          address,
          city,
          state,
          zip_code: zipCode,
          total_amount: totalAmount,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Insert order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error saving order items:", itemsError);
      return NextResponse.json(
        { error: "Failed to save order items" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Order created successfully", orderId: order.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
