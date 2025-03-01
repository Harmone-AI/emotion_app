import { create } from "zustand";
import * as api from "@/api/api";
import { persist, createJSONStorage } from "zustand/middleware";
import storage, { zustandStorage } from "../storage";
import { immer } from "zustand/middleware/immer";

interface StoryState {
  stories: api.Story[];
  lastStoryFetchTime: number;
  latestStoryAvailableAt: string;
  post: () => Promise<void>;
  get: (questId: number) => Promise<void>;
  getStories: () => Promise<void>;
  patch: (storyId: number, data: Partial<api.Story>) => Promise<void>;
}

export const useStoryStore = create<StoryState>()(
  persist(
    immer((set, get) => ({
      stories: [],
      lastStoryFetchTime: 0,
      latestStoryAvailableAt: "",
      post: async () => {},
      get: async (questId: number) => {
        const res = await api.getStoryByQuestId(questId);
        set((state) => {
          state.stories.push(res);
        });
      },
      getStories: async () => {
        const res = await api.getStories();
        set((state) => {
          state.stories = res;
          state.lastStoryFetchTime = Date.now();
        });
      },
      patch: async (storyId: number, data: Partial<api.Story>) => {
        const res = await api.patchStory(storyId, data);
        set((state) => {
          state.stories = state.stories.map((story) => {
            if (story.id === storyId) {
              return res;
            }
            return story;
          });
        });
      },
    })),
    {
      name: "story-storage", // name of the item in the storage (must be unique)
      storage: zustandStorage, // (optional) by default, 'localStorage' is used
    }
  )
);
