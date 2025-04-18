import StorageHelper from "@/hooks/storage";

async function http<T>(url: string, params: any, method?: string): Promise<T> {
  let data: RequestInit = {
    method: method || "POST",
    headers: {
      Authorization: `Bearer ${StorageHelper.supabaseToken}`,
    },
  };
  if (!method || method == "POST" || method == "PUT" || method == "PATCH") {
    data.headers["Content-Type"] = "application/json";
    data.body = JSON.stringify(params);
  }
  let res = await fetch(process.env.EXPO_PUBLIC_ENDPOINT_URL + url, data);
  return res.status == 204
    ? ((await res.text()) as T)
    : ((await res.json()) as T);
}

export type Quest = {
  id: number;
  user_id: number;
  taskids: string;
  status: number;
  created_at: string;
  quest_title: string;
  user_title: string;
  start_message: string;
  end_message: string;
  user_input: string;
  mood: string;
  mood_reason: string;
  begin_img: string;
  end_img: string;

  // local
  confirmed: boolean;
};

export type Task = {
  content: string;
  task_id: number;
  list_id: number;
  user_id: number;
  status: number;
  created_at: string;
};

export async function word2tasklist(params): Promise<Quest> {
  let res = await http<Quest>("/word2tasklist/", params);
  return res;
}

export async function add_task(params: { content: string; list_id: number }) {
  let res = await http<Task>("/add_task/", { ...params, user_id: 1 });
  return res;
}
export async function current_tasklist(userid) {
  let res = await http("/current_tasklist/" + userid, {}, "get");
  return res;
}

export async function task(id: number): Promise<Task> {
  let res = await http<Task>("/get_task/" + id, {}, "get");
  return res;
}

export async function delete_task(id: number): Promise<any> {
  let res = await http<any>("/tasks/" + id, {}, "DELETE");
  return res;
}

export async function patch_task(
  id: number,
  params: Partial<Task>
): Promise<Task> {
  let res = await http<Task>("/tasks/" + id, params, "PATCH");
  return res;
}

export async function quests(): Promise<Quest[]> {
  let res = await http<Quest[]>("/task_lists", {}, "GET");
  return res;
}

export async function patch_quest(
  id: number,
  params: Partial<Quest>
): Promise<Quest> {
  let res = await http<Quest>("/quests/" + id, params, "PATCH");
  return res;
}

export type Character = {
  status: string;
  remaining_seconds: number;
};

export type TaskListCompleted = {
  id: number;
  story_available_at: string;
};

export async function complete_all_task(
  questId: number
): Promise<TaskListCompleted> {
  let res = await http<TaskListCompleted>(
    "/complete_tasklist/" + questId,
    {},
    "POST"
  );
  return res;
}

export async function character(): Promise<Character> {
  let res = await http<Character>("/check_countdown/1", {}, "GET");
  return res;
}

export type Story = {
  id: number;
  user_id: number;
  tasks_id: number;
  title: string;
  story_content: string;
  options: string;
  created_at: string;
  choice?: number;
};

export async function getStoryByQuestId(questId: number): Promise<Story> {
  let res = await http<Story>(
    "/create_story/" + questId,
    { task_list_id: questId, user_id: 1 },
    "POST"
  );
  return res;
}

export async function getStories(): Promise<Story[]> {
  let res = await http<Story[]>("/stories", {}, "GET");
  return res;
}

export async function patchStory(storyId: number, data: Partial<Story>) {
  let res = await http<Story>(`/stories/${storyId}`, data, "PATCH");
  return res;
}

export async function me() {
  let res = await http<Story>(`/me`, {}, "GET");
  return res;
}
