import { Task, TaskTarget } from "@/api/api";
import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

export default class StorageHelper {
  public static get latestTarget(): TaskTarget | null {
    const value = storage.getString("latestTarget");
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }
  public static set latestTarget(value: TaskTarget | null) {
    if (value) {
      storage.set("latestTarget", JSON.stringify(value));
    } else {
      storage.delete("latestTarget");
    }
  }

  public static get tasks(): { [index: number]: Task } | null {
    const value = storage.getString("tasks");
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }
  public static set tasks(value: { [index: number]: Task } | null) {
    if (value) {
      storage.set("tasks", JSON.stringify(value));
    } else {
      storage.delete("tasks");
    }
  }
}
