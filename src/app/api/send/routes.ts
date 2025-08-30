import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        
      }),
    });

    const text = await response.text(); // EmailJS returns plain "OK"

    if (!response.ok || text !== "OK") {
      return NextResponse.json(
        { success: false, error: text || "Unknown EmailJS error" },
        { status: 400 }
      );
    }

    // ✅ Always send JSON to the frontend
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
