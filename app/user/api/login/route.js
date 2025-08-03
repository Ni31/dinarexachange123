import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    await dbConnect();
    
    // Get client IP address
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown";
    
    // Check for existing auth cookie
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;
    
    let user = await User.findOne({ email: email.toLowerCase() });

    // If user does NOT exist, create it
    if (!user) {
      user = await User.create({ 
        email: email.toLowerCase(), 
        trustedIPs: [ip] 
      });
    }

    // Check for auto-login conditions
    let autoLoggedIn = false;
    
    if (authToken) {
      // Verify the auth token matches this user
      const tokenUser = await User.findById(authToken);
      if (tokenUser && tokenUser.email === user.email) {
        autoLoggedIn = true;
      }
    }
    
    // Also check trusted IPs for enhanced security
    if (!autoLoggedIn && user.trustedIPs && user.trustedIPs.includes(ip)) {
      // Set auth cookie for trusted IP
      const response = NextResponse.json({
        autoLoggedIn: true,
        userId: user._id,
        email: user.email,
      }, { status: 200 });

      response.cookies.set('auth-token', user._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
        path: '/',
      });

      return response;
    }

    return NextResponse.json({
      autoLoggedIn,
      userId: user._id,
      email: user.email,
    }, { status: 200 });

  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
