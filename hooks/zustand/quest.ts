import { create } from "zustand";
import * as api from "@/api/api";
import { persist, createJSONStorage } from "zustand/middleware";
import storage, { zustandStorage } from "../storage";

interface QuestState {
  questMap: { [index: string | "latest"]: api.Quest };
  taskMap: { [index: string]: api.Task };
  post: (userInput: string) => Promise<void>;
  confirm: (taskId: number) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      questMap: {},
      taskMap: {},
      post: async (userInput: string) => {
        let res = await api.word2tasklist({
          user_input: userInput,
          user_id: 1,
        });
        const tasks: { [index: string]: api.Task } = {};
        await Promise.all(
          res.taskids.split(",").map(async (item) => {
            const id = Number(item);
            const json = await api.task(id);
            tasks[id] = json;
            return json;
          })
        );
        set({
          questMap: { [res.id]: res, latest: res },
          taskMap: tasks,
        });
      },
      confirm: async (questId: number) => {
        // await api.confirm_task(taskId);
        set((state) => {
          const quest = state.questMap[questId];
          const newQuest = { ...quest, confirmed: true };
          return {
            ...state,
            questMap: {
              ...state.questMap,
              [questId]: newQuest,
              latest:
                questId === state.questMap["latest"].id
                  ? newQuest
                  : state.questMap["latest"],
            },
          };
        });
      },
      deleteTask: async (taskId: number) => {
        set((state) => {
          const questId = Object.keys(state.questMap).find((key) => {
            return state.questMap[key].taskids.includes(taskId.toString());
          })!;
          const taskids = state.questMap[questId].taskids;
          let newTaskids = taskids.replace(taskId + ",", "");
          if (newTaskids === taskids) {
            newTaskids = taskids.replace("," + taskId, "");
          }
          if (newTaskids === taskids) {
            newTaskids = taskids.replace(taskId.toString(), "");
          }
          const newQuest = { ...state.questMap[questId], taskids: newTaskids };
          return {
            ...state,
            questMap: {
              ...state.questMap,
              [questId]: newQuest,
              latest:
                questId === String(state.questMap["latest"].id)
                  ? newQuest
                  : state.questMap["latest"],
            },
          };
        });
      },
    }),
    {
      name: "quest-storage", // name of the item in the storage (must be unique)
      storage: zustandStorage, // (optional) by default, 'localStorage' is used
    }
  )
);
