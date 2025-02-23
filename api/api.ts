async function http<T>(url: string, params: any, method?: string): Promise<T> {
  let data = {
    method: method || "POST",
  };
  if (!method || method == "POST") {
    data.body = JSON.stringify(params);
    data.headers = {
      "Content-Type": "application/json",
    };
  }
  let res = await fetch("https://harmone.ai/new/api" + url, data);
  return (await res.json()) as T;
}

export type TaskTarget = {
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
};

export type Task = {
  content: string;
  task_id: number;
  list_id: number;
  user_id: number;
  status: number;
  created_at: string;
};

export async function word2tasklist(params): Promise<TaskTarget> {
  if (__DEV__) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      id: 63,
      user_id: 1,
      taskids: "167,168,169",
      status: 0,
      created_at: "2025-02-23T09:28:51.516528",
      quest_title: "Positive Vibes",
      user_title: "Joyful Spirit",
      start_message:
        "Hey there! Ready to spread some positivity and embrace the good vibes today? Let's do this!",
      end_message:
        "You did it! Your joyful spirit is contagious. Keep shining bright like a beacon of happiness!",
      user_input: "hello",
      mood: "",
      mood_reason: "",
      begin_img: "https://harmone.ai/story_images/story_images/1.jpg",
      end_img: "https://harmone.ai/story_images/story_images/1.jpg",
    };
  }
  let res = await http<TaskTarget>("/word2tasklist/", params);
  return res;
}

export async function add_task(params) {
  let res = await http("/add_task/", params);
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
