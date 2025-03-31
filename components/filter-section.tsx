"use client"

import { useState, useEffect } from "react"
import { useCommentStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Search, User, Users, X, SlidersHorizontal, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FilterSection() {
  const { comments, setFilteredComments } = useCommentStore()
  const [textFilter, setTextFilter] = useState("")
  const [mentionFilter, setMentionFilter] = useState("")
  const [mentionCount, setMentionCount] = useState([0])
  const [maxMentions, setMaxMentions] = useState(10)
  const [activeFilters, setActiveFilters] = useState(0)

  useEffect(() => {
    // Calculate the maximum number of mentions in any comment
    if (comments.length > 0) {
      const max = Math.max(
        ...comments.map((comment) => {
          const matches = comment.text.match(/@\w+/g)
          return matches ? matches.length : 0
        }),
      )
      setMaxMentions(max > 0 ? max : 1)
    }
  }, [comments])

  useEffect(() => {
    applyFilters()

    // Count active filters
    let count = 0
    if (textFilter.trim()) count++
    if (mentionFilter.trim()) count++
    if (mentionCount[0] > 0) count++
    setActiveFilters(count)
  }, [textFilter, mentionFilter, mentionCount, comments])

  const applyFilters = async () => {
    try {
      const response = await fetch("/api/filter-comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comments,
          textFilter,
          mentionFilter,
          mentionCount: mentionCount[0],
        }),
      })

      const data = await response.json()
      if (data.success) {
        setFilteredComments(data.filteredComments)
      }
    } catch (error) {
      console.error("Error applying filters:", error)
    }
  }

  const resetFilters = () => {
    setTextFilter("")
    setMentionFilter("")
    setMentionCount([0])
    setFilteredComments(comments)
  }

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center text-lg">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <span>Filters</span>
            {activeFilters > 0 && (
              <Badge variant="default" className="ml-2 bg-primary text-primary-foreground">
                {activeFilters} active
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2" aria-label="Reset filters">
            <X className="h-4 w-4 mr-1" /> Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible defaultValue="filters" className="w-full">
          <AccordionItem value="filters" className="border-b-0">
            <AccordionTrigger className="py-2">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filter Options
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="text-filter" className="flex items-center gap-2 text-sm font-medium">
                    <Search className="h-4 w-4 text-primary" /> Text Search
                  </Label>
                  <Input
                    id="text-filter"
                    placeholder="Filter by text content"
                    value={textFilter}
                    onChange={(e) => setTextFilter(e.target.value)}
                    className="border-primary/20 focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mention-filter" className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4 text-primary" /> Mentioned User
                  </Label>
                  <Input
                    id="mention-filter"
                    placeholder="Filter by @username"
                    value={mentionFilter}
                    onChange={(e) => setMentionFilter(e.target.value)}
                    className="border-primary/20 focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4 text-primary" />
                    <div className="flex justify-between w-full">
                      <span>Minimum Mentions</span>
                      <span className="font-bold text-primary">{mentionCount[0]}</span>
                    </div>
                  </Label>
                  <Slider
                    value={mentionCount}
                    min={0}
                    max={maxMentions}
                    step={1}
                    onValueChange={setMentionCount}
                    className="py-2"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={resetFilters} className="w-full border-primary/20">
            Clear All
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={applyFilters}
            className="w-full bg-gradient-to-r from-primary to-primary/80"
          >
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

