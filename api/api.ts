async function http<T>(url: string, params: any, method?: string): Promise<T> {
  let data = {
    method: method || "POST",
  };
  if (!method || method == "POST" || method == "PUT" || method == "PATCH") {
    data.body = JSON.stringify(params);
    data.headers = {
      "Content-Type": "application/json",
    };
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
  let res = await http<Quest[]>("/user/1/task_lists", {}, "GET");
  return res;
}

export type Character = {
  status: string;
  remaining_seconds: number;
};

export async function complete_all_task(
  questId: number
): Promise<Partial<Quest>> {
  let res = await http<Partial<Quest>>(
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
