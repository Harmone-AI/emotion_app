import { create } from "zustand";
import * as api from "@/api/api";
import { persist, createJSONStorage } from "zustand/middleware";
import storage, { zustandStorage } from "../storage";
import { immer } from "zustand/middleware/immer";
import { useStoryStore } from "./story";

interface QuestState {
  latestUserInput: string;
  latestQuestId: number;
  questMap: { [index: string | "latest"]: api.Quest };
  taskMap: { [index: string]: api.Task };
  post: (userInput: string) => Promise<void>;
  getTaskByQuestId: (questId: number) => Promise<void>;
  confirm: (taskId: number) => Promise<void>;
  deleteTask: (taskId: number) => Promise<() => void>;
  finishTask: (taskId: number) => Promise<void>;
  addTask: (questId: number, content: string) => Promise<void>;
  patchTask: (taskId: number, params: Partial<api.Task>) => Promise<void>;
  get: () => Promise<void>;
  finishAllTask: (questId: number) => Promise<void>;
}

export const useQuestStore = create<QuestState>()(
  persist(
    immer((set, get) => ({
      latestUserInput: "",
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
          state.latestUserInput = userInput;
          state.latestQuestId = res.id;
          state.questMap[res.id] = res;
          state.taskMap = { ...state.taskMap, ...tasks };
        });
      },
      getTaskByQuestId: async (questId: number) => {
        const quest = get().questMap[questId];
        const tasks: { [index: string]: api.Task } = {};
        await Promise.all(
          quest.taskids.split(",").map(async (item) => {
            const id = Number(item);
            const json = await api.task(id);
            tasks[id] = json;
            return json;
          })
        );
        set((state) => {
          state.latestQuestId = quest.id;
          state.taskMap = { ...state.taskMap, ...tasks };
        });
      },
      get: async () => {
        const res = await api.quests();
        set((state) => {
          state.questMap = res.reduce((map, quest) => {
            map[quest.id] = quest;
            return map;
          }, {} as { [index: string]: api.Quest });
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
      patchTask: async (taskId: number, params: Partial<api.Task>) => {
        const res = await api.patch_task(taskId, params);
        set((state) => {
          state.taskMap[res.task_id!] = res;
        });
      },
      deleteTask: async (taskId: number) => {
        const oldQuestMap = get().questMap;
        const oldTaskMap = get().taskMap;
        const questId = Object.keys(get().questMap).find((key) => {
          return get()
            .questMap[key].taskids.split(",")
            .includes(taskId.toString());
        })!;
        const oldTaskIds = get().questMap[questId].taskids;
        const oldTask = get().taskMap[taskId];
        set((state) => {
          state.questMap[questId].taskids = state.questMap[questId].taskids
            .split(",")
            .filter((item) => item !== taskId.toString())
            .join(",");
          delete state.taskMap[taskId];
        });
        const timer = setTimeout(() => {
          api.delete_task(taskId);
        }, 3000);
        return () => {
          console.log("undo");
          set((state) => {
            state.questMap[questId].taskids = oldTaskIds;
            state.taskMap[taskId] = oldTask;
          });
          clearTimeout(timer);
        };
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
          state.questMap[questId].taskids = newTaskIds.join(",");
          state.taskMap[task.task_id] = task;
        });
      },
      finishAllTask: async (questId: number) => {
        const quest = await api.complete_all_task(questId);
        set((state) => {
          state.questMap[questId] = { ...state.questMap[questId], ...quest };
          useStoryStore.setState({
            latestStoryAvailableAt: quest.story_available_at,
          });
        });
      },
    })),
    {
      name: "quest-storage", // name of the item in the storage (must be unique)
      storage: zustandStorage, // (optional) by default, 'localStorage' is used
    }
  )
);
