import dbConnect from "@/lib/mongodb";
import UserOrder from "@/models/UserOrder";

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email parameter is required' }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const orders = await UserOrder.find({ userEmail: email }).sort({ createdAt: -1 });

    return new Response(JSON.stringify({ orders }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GET /user/api/orders error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
   const { id } = await params; 
    const body = await request.json();

    const updatedOrder = await UserOrder.findByIdAndUpdate(id, body, { new: true });

    if (!updatedOrder) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ order: updatedOrder }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("PATCH /user/api/orders/[id] error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
