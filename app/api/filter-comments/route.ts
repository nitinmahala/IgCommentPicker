import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { comments, textFilter, mentionFilter, mentionCount } = await request.json()

    if (!Array.isArray(comments)) {
      return NextResponse.json({ success: false, message: "Invalid comments data" }, { status: 400 })
    }

    let filteredComments = [...comments]

    // Apply text filter
    if (textFilter && textFilter.trim() !== "") {
      const textFilterLower = textFilter.toLowerCase()
      filteredComments = filteredComments.filter((comment) => comment.text.toLowerCase().includes(textFilterLower))
    }

    // Apply mention filter
    if (mentionFilter && mentionFilter.trim() !== "") {
      let mentionFilterFormatted = mentionFilter.trim()
      // Add @ if not present
      if (!mentionFilterFormatted.startsWith("@")) {
        mentionFilterFormatted = `@${mentionFilterFormatted}`
      }

      filteredComments = filteredComments.filter((comment) => comment.text.includes(mentionFilterFormatted))
    }

    // Apply mention count filter
    if (mentionCount !== undefined && mentionCount >= 0) {
      filteredComments = filteredComments.filter((comment) => {
        const matches = comment.text.match(/@\w+/g)
        const count = matches ? matches.length : 0
        return count >= mentionCount
      })
    }

    return NextResponse.json({
      success: true,
      filteredComments,
    })
  } catch (error) {
    console.error("Error filtering comments:", error)
    return NextResponse.json({ success: false, message: "Failed to filter comments" }, { status: 500 })
  }
}

