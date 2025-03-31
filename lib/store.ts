import { create } from "zustand"
import type { Comment } from "./types"

interface CommentState {
  comments: Comment[]
  filteredComments: Comment[]
  randomComment: Comment | null
  setComments: (comments: Comment[]) => void
  setFilteredComments: (comments: Comment[]) => void
  setRandomComment: (comment: Comment | null) => void
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: [],
  filteredComments: [],
  randomComment: null,
  setComments: (comments) => set({ comments, filteredComments: comments }),
  setFilteredComments: (filteredComments) => set({ filteredComments }),
  setRandomComment: (randomComment) => set({ randomComment }),
}))

