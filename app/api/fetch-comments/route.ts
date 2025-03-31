import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for comments
const commentsStore: Record<string, any[]> = {}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const postId = searchParams.get("postId")

  if (!postId) {
    return NextResponse.json({ success: false, message: "Post ID is required" }, { status: 400 })
  }

  try {
    // Check if we already have the comments in memory
    if (commentsStore[postId]) {
      return NextResponse.json({
        success: true,
        comments: commentsStore[postId],
      })
    }

    // In a real app, you would fetch from Instagram API here
    // For demo purposes, we'll generate mock data
    const mockComments = generateMockComments(postId)

    // Store in memory
    commentsStore[postId] = mockComments

    return NextResponse.json({
      success: true,
      comments: mockComments,
    })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch comments" }, { status: 500 })
  }
}

// Helper function to generate mock comments
function generateMockComments(postId: string) {
  const usernames = [
    "john_doe",
    "jane_smith",
    "photo_lover",
    "travel_enthusiast",
    "fitness_guru",
    "food_critic",
    "art_appreciator",
    "music_fan",
    "book_worm",
    "tech_geek",
    "nature_explorer",
    "urban_photographer",
  ]

  const profilePics = [
    "/placeholder.svg?height=40&width=40&text=JD",
    "/placeholder.svg?height=40&width=40&text=JS",
    "/placeholder.svg?height=40&width=40&text=PL",
    "/placeholder.svg?height=40&width=40&text=TE",
    "/placeholder.svg?height=40&width=40&text=FG",
    "/placeholder.svg?height=40&width=40&text=FC",
  ]

  const commentTexts = [
    "Love this! 😍",
    "Amazing shot! 📸",
    "This is incredible @friend_tag",
    "Can't believe how beautiful this is!",
    "Wow, stunning! @friend1 @friend2 check this out",
    "This made my day! Thanks for sharing",
    "I need to visit this place @travel_buddy",
    "Absolutely gorgeous! @bestie you would love this",
    "This is exactly what I needed to see today",
    "Perfection! @friend1 @friend2 @friend3 we should try this",
    "I'm speechless... this is art",
    "This deserves more likes! @everyone check this out",
    "I've been waiting for you to post something like this!",
    "This is why I follow you! Amazing content as always",
    "Can you share your process? @creator_friend might want to know too",
  ]

  // Generate 20-50 random comments
  const count = Math.floor(Math.random() * 30) + 20
  const comments = []

  for (let i = 0; i < count; i++) {
    const username = usernames[Math.floor(Math.random() * usernames.length)]
    const text = commentTexts[Math.floor(Math.random() * commentTexts.length)]
    const profilePic = profilePics[Math.floor(Math.random() * profilePics.length)]

    // Add random timestamp within the last week
    const timestamp = new Date()
    timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 7))

    comments.push({
      id: `comment_${postId}_${i}`,
      username,
      text,
      timestamp: timestamp.toISOString(),
      profile_pic_url: profilePic,
    })
  }

  return comments
}

