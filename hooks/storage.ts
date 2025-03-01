import { Task, Quest } from "@/api/api";
import { MMKV } from "react-native-mmkv";
import { createJSONStorage } from "zustand/middleware";

export const storage = new MMKV();

export default class StorageHelper {
  public static get latestTarget(): Quest | null {
    const value = storage.getString("latestTarget");
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }
  public static set latestTarget(value: Quest | null) {
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
  public static get supabaseToken(): string | null {
    const value = storage.getString("sb-supa-auth-token");
    if (value) {
      return JSON.parse(value).access_token;
    }
    return null;
  }
}

export const zustandStorage = createJSONStorage(() => ({
  getItem: (name: string): string | null | Promise<string | null> => {
    let nullableValue: null | string = null;
    let value = storage.getString(name);
    if (value === undefined) {
      nullableValue = null;
    } else {
      nullableValue = value;
    }
    return nullableValue;
  },
  setItem: (name: string, value: string): unknown | Promise<unknown> => {
    return storage.set(name, value);
  },
  removeItem: (name: string): unknown | Promise<unknown> => {
    return storage.delete(name);
  },
}));

export const supabaseStorage = {
  getItem: (key: string) => {
    let nullableValue: null | string = null;
    let value = storage.getString(key);
    if (value === undefined) {
      nullableValue = null;
    } else {
      nullableValue = value;
    }
    return nullableValue;
  },

  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
  isServer: false,
};
