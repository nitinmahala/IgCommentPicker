import { Instagram, Github, Twitter, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">InstaCommentPicker</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A tool to fetch, filter, and randomly select comments from Instagram posts.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                  Instagram API Documentation
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Connect</h3>
            <div className="flex space-x-3">
              <a href="https://github.com/nitinmahala" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by InstaCommentPicker Team
          </p>
          <p className="mt-1">© {new Date().getFullYear()} InstaCommentPicker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
