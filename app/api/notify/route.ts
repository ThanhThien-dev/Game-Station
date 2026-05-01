import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { type, to, bookingId, comboName, date, time, amount, guestName } = await request.json();

    // In production, use Resend:
    // import { Resend } from "resend";
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "Joy Station <noreply@joystation.vn>",
    //   to,
    //   subject: type === "booking-confirmation" ? `Xác nhận #${bookingId}` : "Đơn mới!",
    //   html: getEmailTemplate(type, { bookingId, comboName, date, time, amount, guestName }),
    // });

    // Save in-memory notification
    const notification = {
      id: `notif-${Date.now()}`,
      type,
      to,
      bookingId,
      comboName,
      date,
      time,
      amount,
      guestName,
      status: "sent",
      createdAt: new Date().toISOString(),
    };

    console.log(`[Notification] ${type} → ${to}:`, notification);

    // Push to global notifications (demo)
    if (typeof global !== "undefined") {
      (global as Record<string, unknown>).__joyNotifications =
        [(global as Record<string, unknown>).__joyNotifications || [], notification].flat();
    }

    return NextResponse.json({ success: true, notification });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to send notification" }, { status: 500 });
  }
}