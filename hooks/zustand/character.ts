import { create } from "zustand";
import * as api from "@/api/api";
import { persist, createJSONStorage } from "zustand/middleware";
import storage, { zustandStorage } from "../storage";
import { immer } from "zustand/middleware/immer";

interface CharacterState {
  character: api.Character;
  returnHomeDuration: number;
  get: () => Promise<void>;
}

export const useCharacterStore = create<CharacterState>()(
  persist(
    immer((set, get) => ({
      character: {},
      returnHomeDuration: 0,
      get: async () => {
        const res = await api.character();
        set((state) => {
          state.character = res;
          state.returnHomeDuration = Date.now() + res.remaining_seconds * 1000;
        });
      },
    })),
    {
      name: "character-storage", // name of the item in the storage (must be unique)
      storage: zustandStorage, // (optional) by default, 'localStorage' is used
    }
  )
);
