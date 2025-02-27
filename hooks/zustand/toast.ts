import { create } from "zustand";
import * as api from "@/api/api";
import { persist, createJSONStorage } from "zustand/middleware";
import storage, { zustandStorage } from "../storage";
import { immer } from "zustand/middleware/immer";

interface ToastState {
  message: string;
  actionText?: string;
  action?: () => void;
  timeout?: number;
  show: ({
    message,
    action,
    actionText,
    timeout,
  }: {
    message: string;
    action?: () => void;
    actionText?: string;
    timeout?: number;
  }) => Promise<void>;
}
let timer: number | null = null;
export const useToastStore = create<ToastState>()(
  immer((set, get) => ({
    message: "",
    actionText: "",
    action: () => {},
    timeout: 1500,
    show: async ({ message, action, actionText, timeout }) => {
      clearTimeout(timer);
      if (message) {
        timer = setTimeout(() => {
          set((state) => {
            state.message = "";
          });
        }, timeout || get().timeout);
      }
      set((state) => {
        state.message = message;
        if (action) {
          state.action = action;
        }
        state.actionText = actionText;
      });
    },
  }))
);
