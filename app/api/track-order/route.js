import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function GET(req) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const phone = searchParams.get('phone')
    const awb = searchParams.get('awb')
    const email = searchParams.get('email')

    if (!phone && !awb && !email) {
      return NextResponse.json(
        { success: false, message: 'Email and/or Order Number is required' },
        { status: 400 }
      )
    }

    let order = null;
    if (awb) {
      const awbTrim = awb.trim();
      // 1. Try by trackingId
      order = await Order.findOne({ trackingId: awbTrim })
        .populate('orderItems.productId')
        .sort({ createdAt: -1 })
        .lean();
      // 2. Try by full orderId (ObjectId)
      if (!order && /^[a-fA-F0-9]{24}$/.test(awbTrim)) {
        order = await Order.findOne({ _id: awbTrim })
          .populate('orderItems.productId')
          .lean();
      }
      // 3. Try by shortOrderNumber field
      if (!order && /^\d{1,}$/.test(awbTrim)) {
        order = await Order.findOne({ shortOrderNumber: Number(awbTrim) })
          .populate('orderItems.productId')
          .lean();
      }
    }
    // 4. Try by phone number if provided (fallback)
    if (!order && phone) {
      order = await Order.findOne({ 'shippingAddress.phone': phone.trim() })
        .populate('orderItems.productId')
        .sort({ createdAt: -1 })
        .lean();
    }
    // Optional email match check
    if (order && email) {
      const normalizedEmail = email.trim().toLowerCase()
      const orderEmails = [
        order.guestEmail?.toLowerCase?.(),
        order.shippingAddress?.email?.toLowerCase?.()
      ].filter(Boolean)
      if (!orderEmails.length || !orderEmails.includes(normalizedEmail)) {
        return NextResponse.json(
          { success: false, message: 'Email does not match the order' },
          { status: 404 }
        )
      }
    }
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found with the provided information' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Track order error:', error && error.stack ? error.stack : error)
    return NextResponse.json(
      { success: false, message: 'Failed to track order', error: error?.message || error },
      { status: 500 }
    )
  }
}
