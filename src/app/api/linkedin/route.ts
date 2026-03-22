import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || !url.includes("linkedin.com/in/")) {
      return NextResponse.json(
        { error: "Invalid LinkedIn URL" },
        { status: 400 }
      )
    }

    // Fetch the LinkedIn profile page
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch LinkedIn profile" },
        { status: 500 }
      )
    }

    const html = await response.text()

    // Extract profile image from the HTML
    // LinkedIn uses various patterns for profile images
    const patterns = [
      // Main profile image in meta tags
      /<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i,
      // Profile image in img tags
      /img[^>]*src="(https:\/\/media\.licdn\.com\/dms\/image\/[^"]+)"/i,
      // Profile photo modal image
      /pv-member-photo-modal__content-image[^>]*src="([^"]+)"/i,
    ]

    let imageUrl: string | null = null

    for (const pattern of patterns) {
      const match = html.match(pattern)
      if (match && match[1]) {
        imageUrl = match[1]
        // Prefer higher quality images (avoid thumbnails)
        if (imageUrl.includes("profile-displayphoto") || imageUrl.includes("/v2/")) {
          break
        }
      }
    }

    // Extract name from the page
    const nameMatch = html.match(/<title>([^|<]+)/i)
    const name = nameMatch ? nameMatch[1].trim().replace(" - LinkedIn", "").replace(" | LinkedIn", "") : null

    // Extract headline
    const headlineMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i)
    const headline = headlineMatch ? headlineMatch[1].split(" - ")[0] : null

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Could not find profile image", name, headline },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      name,
      headline,
    })
  } catch (error) {
    console.error("LinkedIn scrape error:", error)
    return NextResponse.json(
      { error: "Failed to scrape LinkedIn profile" },
      { status: 500 }
    )
  }
}
