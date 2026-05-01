import { NextResponse } from "next/server";

// In-memory store (demo only - use Supabase/DB in production)
const bookings: Array<Record<string, unknown>> = [];

const comboPrices: Record<number, number> = {
  1: 129000,
  2: 249000,
  3: 399000,
};

const comboNames: Record<number, string> = {
  1: "Nintendo Switch",
  2: "Xbox 360",
  3: "PlayStation PS4",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { comboId, bookingDate, bookingTime, playerCount, guestName, guestPhone, guestEmail, notes } = body;

    // Validation
    if (!comboId || !bookingDate || !bookingTime || !guestName || !guestPhone) {
      return NextResponse.json({ success: false, error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    // Generate booking ID
    const bookingId = "JS-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();

    // Calculate price
    const totalPrice = comboPrices[Number(comboId)] || 129000;

    // Store booking (demo - replace with Supabase in production)
    const booking = {
      id: bookingId,
      comboId,
      comboName: comboNames[Number(comboId)] || "Unknown",
      bookingDate,
      bookingTime,
      playerCount,
      guestName,
      guestPhone,
      guestEmail,
      notes,
      totalPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    bookings.push(booking);

    console.log("New booking:", booking);

    return NextResponse.json({ success: true, bookingId, totalPrice });
  } catch {
    return NextResponse.json({ success: false, error: "Lỗi server" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ bookings });
}