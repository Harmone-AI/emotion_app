import { create } from "zustand";
import * as api from "@/api/api";
import { persist, createJSONStorage } from "zustand/middleware";
import storage, { zustandStorage } from "../storage";
import { immer } from "zustand/middleware/immer";

interface StoryState {
  storyMap: { [index: string]: api.Story };
  post: () => Promise<void>;
}

export const useStoryStore = create<StoryState>()(
  persist(
    immer((set, get) => ({
      storyMap: {},
      post: async () => {},
    })),
    {
      name: "story-storage", // name of the item in the storage (must be unique)
      storage: zustandStorage, // (optional) by default, 'localStorage' is used
    }
  )
);
