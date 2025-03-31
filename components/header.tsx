"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Instagram, HelpCircle } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Instagram className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl hidden sm:inline-block">InstaCommentPicker</span>
        </div>

        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>How to use</SheetTitle>
                <SheetDescription>A guide to using the Instagram Comment Picker</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="font-medium mb-1">1. Enter Post ID</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter an Instagram post URL or ID in the input field and click "Fetch Comments"
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">2. Filter Comments</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the filter options to narrow down comments by text, mentioned users, or number of mentions
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">3. Pick a Random Comment</h3>
                  <p className="text-sm text-muted-foreground">
                    Click "Pick Random" to select a random comment from the filtered results
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">4. Share Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Copy or share the selected comment using the buttons provided
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

