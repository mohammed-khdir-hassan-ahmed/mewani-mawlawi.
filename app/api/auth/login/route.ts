import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    console.log('🔐 Login attempt with username:', username);

    // Simple username/password check
    const adminUsername = 'hama53';
    const adminPassword = '53hama';

    if (username === adminUsername && password === adminPassword) {
      console.log('✅ Credentials valid');
      // Create response with proper redirect
      const response = NextResponse.json(
        { success: true, message: 'Login successful' },
        { status: 200 }
      );

      // Set secure cookie for authentication
      response.cookies.set('adminAuth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      console.log('✅ Auth cookie set, response sent');
      return response;
    } else {
      console.error('❌ Invalid credentials - username:', username);
      return NextResponse.json(
        { success: false, message: 'ناویی بەکارهێنەر یان وشەی نهێنی هەڵەیە' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('❌ Login API error:', error);
    return NextResponse.json(
      { success: false, message: 'خۆڵای سێرڤەر: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
