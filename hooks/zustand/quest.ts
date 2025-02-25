import { create } from "zustand";
import * as api from "@/api/api";
import { persist, createJSONStorage } from "zustand/middleware";
import storage, { zustandStorage } from "../storage";

interface QuestState {
  latestQuestId: number;
  questMap: { [index: string | "latest"]: api.Quest };
  taskMap: { [index: string]: api.Task };
  post: (userInput: string) => Promise<void>;
  confirm: (taskId: number) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  finishTask: (taskId: number) => Promise<void>;
  addTask: (questId: number, content: string) => Promise<void>;
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      latestQuestId: 0,
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
        set((state) => {
          return {
            ...state,
            questMap: { ...state.questMap, [res.id]: res },
            taskMap: { ...state.taskMap, ...tasks },
            latestQuestId: res.id,
          };
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
            },
          };
        });
      },
      deleteTask: async (taskId: number) => {
        set((state) => {
          const questId = Object.keys(state.questMap).find((key) => {
            return state.questMap[key].taskids.includes(taskId.toString());
          })!;
          const newTaskids = state.questMap[questId].taskids
            .split(",")
            .filter((item) => item !== taskId.toString())
            .join(",");
          const newQuest = { ...state.questMap[questId], taskids: newTaskids };
          return {
            ...state,
            questMap: {
              ...state.questMap,
              [questId]: newQuest,
            },
          };
        });
      },
      finishTask: async (taskId: number) => {
        set((state) => {
          return {
            ...state,
            taskMap: {
              ...state.taskMap,
              [taskId]: {
                ...state.taskMap[taskId],
                status: state.taskMap[taskId].status === 0 ? 1 : 0,
              },
            },
          };
        });
      },
      addTask: async (questId: number, content: string) => {
        const task = await api.add_task({
          list_id: questId,
          content,
        });
        const newTaskIds = get().questMap[questId].taskids.split(",");
        newTaskIds.push(String(task.task_id));
        set((state) => {
          return {
            ...state,
            questMap: {
              ...state.questMap,
              [questId]: {
                ...state.questMap[questId],
                taskids: newTaskIds.join(","),
              },
            },
            taskMap: {
              ...state.taskMap,
              [task.task_id]: task,
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
