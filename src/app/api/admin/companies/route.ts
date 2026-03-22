import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/store"
import { Company } from "@/lib/types"

export async function GET() {
  const companies = store.getCompanies()
  return NextResponse.json({ companies })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const company: Company = {
      id: data.name.toLowerCase().replace(/[^a-z0-9]/g, ""),
      name: data.name,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      logoUrl: data.logoUrl || null,
      industry: data.industry || "Technology",
      createdAt: new Date().toISOString().split("T")[0],
    }

    store.addCompany(company)

    return NextResponse.json({ success: true, company })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create company" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json()
    store.updateCompany(id, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update company" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    store.deleteCompany(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete company" },
      { status: 500 }
    )
  }
}
