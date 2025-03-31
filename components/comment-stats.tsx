"use client"

import { useCommentStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Activity, Users } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  PieChart as RechartsChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { useMemo } from "react"

export default function CommentStats() {
  const { comments, filteredComments } = useCommentStore()

  const mentionStats = useMemo(() => {
    if (comments.length === 0) return []

    // Count comments by number of mentions
    const mentionCounts: Record<number, number> = {}

    comments.forEach((comment) => {
      const matches = comment.text.match(/@\w+/g)
      const count = matches ? matches.length : 0
      mentionCounts[count] = (mentionCounts[count] || 0) + 1
    })

    // Convert to array format for chart
    return Object.entries(mentionCounts).map(([mentions, count]) => ({
      name: mentions === "0" ? "No mentions" : `${mentions} mention${Number(mentions) > 1 ? "s" : ""}`,
      value: count,
    }))
  }, [comments])

  const userStats = useMemo(() => {
    if (comments.length === 0) return []

    // Count comments by username
    const userCounts: Record<string, number> = {}

    comments.forEach((comment) => {
      userCounts[comment.username] = (userCounts[comment.username] || 0) + 1
    })

    // Sort by count and take top 5
    return Object.entries(userCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([username, count]) => ({
        name: username,
        value: count,
      }))
  }, [comments])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  if (comments.length === 0) return null

  return (
    <Card className="mt-6 border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-primary" />
          <span>Statistics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Accordion type="single" collapsible defaultValue="mentions" className="w-full">
          <AccordionItem value="mentions" className="border-b-0">
            <AccordionTrigger className="py-2">
              <span className="flex items-center gap-2">
                <PieChart className="h-4 w-4" /> Mentions Distribution
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="h-[200px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsChart>
                    <Pie
                      data={mentionStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {mentionStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsChart>
                </ResponsiveContainer>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="users" className="border-b-0">
            <AccordionTrigger className="py-2">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Top Commenters
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="h-[200px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={userStats}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-primary/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{comments.length}</div>
            <div className="text-xs text-muted-foreground">Total Comments</div>
          </div>
          <div className="bg-primary/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{filteredComments.length}</div>
            <div className="text-xs text-muted-foreground">Filtered Comments</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

