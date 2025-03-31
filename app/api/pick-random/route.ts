import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { comments } = await request.json()

    if (!Array.isArray(comments) || comments.length === 0) {
      return NextResponse.json({ success: false, message: "No comments to pick from" }, { status: 400 })
    }

    // Pick a random comment
    const randomIndex = Math.floor(Math.random() * comments.length)
    const randomComment = comments[randomIndex]

    return NextResponse.json({
      success: true,
      comment: randomComment,
    })
  } catch (error) {
    console.error("Error picking random comment:", error)
    return NextResponse.json({ success: false, message: "Failed to pick random comment" }, { status: 500 })
  }
}

