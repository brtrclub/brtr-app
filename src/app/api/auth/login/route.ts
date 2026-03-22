import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password required" },
        { status: 400 }
      )
    }

    const user = store.authenticate(username, password)

    if (user) {
      // Don't send password back
      const { password: _, ...userWithoutPassword } = user
      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
      })
    }

    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    )
  }
}
