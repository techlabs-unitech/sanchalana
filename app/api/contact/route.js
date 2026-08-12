import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { name, email, subject, message } = payload || {};
  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    // Supabase isn't configured yet — tell the caller so the UI can show
    // a helpful message instead of pretending the message was saved.
    return NextResponse.json({ ok: false, error: "supabase_not_configured" }, { status: 501 });
  }

  const { error } = await supabase.from("messages").insert({
    name,
    email,
    subject: subject || null,
    message,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
