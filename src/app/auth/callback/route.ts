import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user needs to complete profile
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Check if user has a profile in our database
        const res = await fetch(
          `${origin}/api/users/me?authId=${user.id}`
        );
        const data = await res.json();

        if (!data.user) {
          // Redirect to onboarding
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to login on error
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
