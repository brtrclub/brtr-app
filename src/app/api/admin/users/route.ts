import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/store"
import { User, TeamMember } from "@/lib/types"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const companyId = searchParams.get("companyId")

  if (companyId) {
    const users = store.getUsersByCompany(companyId)
    return NextResponse.json({ users })
  }

  const users = store.getUsers()
  return NextResponse.json({ users })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Check if username already exists
    const existing = store.getUserByUsername(data.username)
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Username already exists" },
        { status: 400 }
      )
    }

    const colors: Array<"amber" | "copper" | "silver"> = ["amber", "copper", "silver"]
    const color = colors[Math.floor(Math.random() * colors.length)]

    const user: User = {
      id: Date.now().toString(),
      username: data.username,
      password: data.password,
      name: data.name,
      email: data.email,
      role: data.role || "user",
      companyId: data.companyId,
      photoUrl: data.photoUrl || null,
      initials: data.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
      color,
    }

    store.addUser(user)

    // Also create team member if it's a company user
    if (data.companyId && data.role !== "company_admin") {
      const teamMember: TeamMember = {
        id: `tm-${user.id}`,
        userId: user.id,
        companyId: data.companyId,
        name: user.name,
        initials: user.initials,
        role: data.jobRole || "Team Member",
        focus: data.focus || "",
        color,
        photoUrl: data.photoUrl || null,
        isLead: data.isLead || false,
      }
      store.addTeamMember(teamMember)
    }

    // Don't send password back
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ success: true, user: userWithoutPassword })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json()
    store.updateUser(id, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    store.deleteUser(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    )
  }
}
