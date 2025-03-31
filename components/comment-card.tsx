import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Comment } from "@/lib/types"
import { Heart, MessageCircle } from "lucide-react"

interface CommentCardProps {
  comment: Comment
  highlighted?: boolean
  compact?: boolean
}

export default function CommentCard({ comment, highlighted = false, compact = false }: CommentCardProps) {
  // Function to highlight mentions in the text
  const renderCommentText = (text: string) => {
    // Simple regex to find @mentions
    const parts = text.split(/(@\w+)/g)

    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        return (
          <span key={index} className="text-primary font-medium">
            {part}
          </span>
        )
      }
      return part
    })
  }

  // Count mentions in the comment
  const mentionCount = (comment.text.match(/@\w+/g) || []).length

  return (
    <Card
      className={cn(
        "transition-all border-primary/10 hover:border-primary/30",
        highlighted && "border-primary bg-primary/5 shadow-md",
        compact ? "h-full" : "",
      )}
    >
      <CardContent className={cn("p-4", compact ? "p-3" : "")}>
        <div className="flex items-start gap-3">
          <Avatar className={cn("border-2 border-primary/10", highlighted && "border-primary/30")}>
            <AvatarImage
              src={comment.profile_pic_url || `/placeholder.svg?height=40&width=40`}
              alt={comment.username}
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {comment.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium truncate">{comment.username}</span>
              {highlighted && (
                <Badge variant="default" className="bg-primary text-primary-foreground">
                  Selected
                </Badge>
              )}
              {mentionCount > 0 && (
                <Badge variant="outline" className="ml-auto text-xs">
                  <MessageCircle className="h-3 w-3 mr-1" /> {mentionCount}
                </Badge>
              )}
            </div>
            <p className={cn("mt-1 break-words", compact ? "line-clamp-3" : "")}>{renderCommentText(comment.text)}</p>
            <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
              <span>{new Date(comment.timestamp).toLocaleString()}</span>
              <div className="flex items-center">
                <Heart className="h-3 w-3 mr-1 text-primary/70" />
                <span>{Math.floor(Math.random() * 10)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

