import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { customer, items, total } = await request.json()

    const supabase = await getSupabaseServerClient()

    // Crear o buscar cliente
    let customerId = null
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("email", customer.email)
      .single()

    if (existingCustomer) {
      customerId = existingCustomer.id
    } else {
      const { data: newCustomer, error: customerError } = await supabase
        .from("customers")
        .insert({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
        })
        .select("id")
        .single()

      if (customerError) {
        console.error("[v0] Error creating customer:", customerError)
      } else {
        customerId = newCustomer.id
      }
    }

    // Crear pedido
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: customerId,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        customer_address: customer.address,
        total,
        status: "pending",
      })
      .select("id")
      .single()

    if (orderError) {
      console.error("[v0] Error creating order:", orderError)
      return NextResponse.json({ error: "Error al crear el pedido" }, { status: 500 })
    }

    // Crear items del pedido
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_price: item.product_price,
      quantity: item.quantity,
      subtotal: item.product_price * item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("[v0] Error creating order items:", itemsError)
      return NextResponse.json({ error: "Error al crear los items del pedido" }, { status: 500 })
    }

    return NextResponse.json({ orderId: order.id })
  } catch (error) {
    console.error("[v0] Error processing order:", error)
    return NextResponse.json({ error: "Error al procesar el pedido" }, { status: 500 })
  }
}
