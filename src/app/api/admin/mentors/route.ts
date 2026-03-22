import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/store"
import { Mentor } from "@/lib/types"

export async function GET() {
  const mentors = store.getMentors()
  return NextResponse.json({ mentors })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const mentor: Mentor = {
      id: Date.now().toString(),
      name: data.name,
      initials: data.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
      email: data.email,
      headline: data.headline || "",
      company: data.company || "",
      linkedIn: data.linkedIn || "",
      photoUrl: data.photoUrl || null,
      expertise: data.expertise || [],
      assignedCompanies: data.assignedCompanies || [],
    }

    store.addMentor(mentor)

    return NextResponse.json({ success: true, mentor })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create mentor" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json()
    store.updateMentor(id, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update mentor" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    store.deleteMentor(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete mentor" },
      { status: 500 }
    )
  }
}
