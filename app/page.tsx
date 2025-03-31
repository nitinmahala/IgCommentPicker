"use client"

import { useState } from "react"
import { useCommentStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, RefreshCw, Copy, Share2, Instagram } from "lucide-react"
import CommentCard from "@/components/comment-card"
import FilterSection from "@/components/filter-section"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CommentStats from "@/components/comment-stats"
import { useTheme } from "next-themes"

export default function Home() {
  const [postId, setPostId] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("comments")
  const { toast } = useToast()
  const { theme } = useTheme()

  const { comments, filteredComments, randomComment, setComments, setFilteredComments, setRandomComment } =
    useCommentStore()

  const fetchComments = async () => {
    if (!postId.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/fetch-comments?postId=${encodeURIComponent(postId)}`)
      const data = await response.json()

      if (data.success) {
        setComments(data.comments)
        setFilteredComments(data.comments)
        toast({
          title: "Comments Loaded",
          description: `Successfully loaded ${data.comments.length} comments`,
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch comments",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast({
        title: "Error",
        description: "An error occurred while fetching comments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const pickRandomComment = async () => {
    if (filteredComments.length === 0) return

    try {
      const response = await fetch("/api/pick-random", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comments: filteredComments }),
      })

      const data = await response.json()
      if (data.success) {
        setRandomComment(data.comment)
        toast({
          title: "Comment Selected",
          description: "Random comment has been selected!",
        })
      }
    } catch (error) {
      console.error("Error picking random comment:", error)
    }
  }

  const copyCommentText = () => {
    if (!randomComment) return

    navigator.clipboard.writeText(randomComment.text)
    toast({
      title: "Copied!",
      description: "Comment text copied to clipboard",
    })
  }

  const shareResults = () => {
    if (!randomComment) return

    const text = `Selected comment from Instagram: "${randomComment.text}" by @${randomComment.username}`

    if (navigator.share) {
      navigator
        .share({
          title: "Instagram Comment Picker Results",
          text: text,
        })
        .catch((err) => console.error("Error sharing:", err))
    } else {
      navigator.clipboard.writeText(text)
      toast({
        title: "Ready to Share",
        description: "Result copied to clipboard",
      })
    }
  }

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-b from-background to-background/50`}>
      <Header />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-5xl mx-auto">
          <Card className="mb-8 border-none shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
                <Instagram className="h-6 w-6 text-primary" />
                Instagram Comment Picker
              </CardTitle>
              <CardDescription>Enter an Instagram post URL or ID to fetch and filter comments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <Label htmlFor="post-id" className="sr-only">
                    Instagram Post ID or URL
                  </Label>
                  <Input
                    id="post-id"
                    placeholder="Instagram Post ID or URL"
                    value={postId}
                    onChange={(e) => setPostId(e.target.value)}
                    disabled={loading}
                    className="border-primary/20 focus-visible:ring-primary"
                  />
                </div>
                <Button
                  onClick={fetchComments}
                  disabled={loading || !postId.trim()}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    "Fetch Comments"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {comments.length > 0 && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-1">
                  <FilterSection />

                  {randomComment && (
                    <Card className="mt-6 border-primary/20 shadow-md bg-gradient-to-br from-primary/5 to-background">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Selected Comment</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <CommentCard comment={randomComment} highlighted />
                      </CardContent>
                      <CardFooter className="flex gap-2 pt-0">
                        <Button variant="outline" size="sm" onClick={copyCommentText} className="flex-1">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={shareResults} className="flex-1">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </CardFooter>
                    </Card>
                  )}

                  <CommentStats />
                </div>

                <div className="lg:col-span-2">
                  <Card className="border-none shadow-lg">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="comments">Comments ({filteredComments.length})</TabsTrigger>
                            <TabsTrigger value="gallery">Gallery View</TabsTrigger>
                          </TabsList>
                        </Tabs>

                        <Button
                          variant="default"
                          size="sm"
                          onClick={pickRandomComment}
                          disabled={filteredComments.length === 0}
                          className="ml-4 bg-gradient-to-r from-primary to-primary/80"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Pick Random
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs value={activeTab} className="w-full">
                        <TabsContent value="comments" className="m-0">
                          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 mt-4">
                            {filteredComments.length > 0 ? (
                              filteredComments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
                            ) : (
                              <div className="text-center py-12 px-4 border border-dashed rounded-lg border-primary/20">
                                <p className="text-muted-foreground">No comments match your filters</p>
                                <Button
                                  variant="link"
                                  onClick={() => {
                                    document.querySelector('button[aria-label="Reset filters"]')?.click()
                                  }}
                                >
                                  Reset filters
                                </Button>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                        <TabsContent value="gallery" className="m-0">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 mt-4">
                            {filteredComments.length > 0 ? (
                              filteredComments.map((comment) => (
                                <CommentCard key={comment.id} comment={comment} compact />
                              ))
                            ) : (
                              <div className="text-center py-12 px-4 border border-dashed rounded-lg border-primary/20 sm:col-span-2">
                                <p className="text-muted-foreground">No comments match your filters</p>
                                <Button
                                  variant="link"
                                  onClick={() => {
                                    document.querySelector('button[aria-label="Reset filters"]')?.click()
                                  }}
                                >
                                  Reset filters
                                </Button>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

