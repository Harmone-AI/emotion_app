import { create } from "zustand";
import * as api from "@/api/api";
import { persist, createJSONStorage, StorageValue } from "zustand/middleware";
import { zustandStorage } from "../storage";
import { immer } from "zustand/middleware/immer";
import { Settings } from "react-native";
import React from "react";

type SessionReplyPermissionStatus = "granted" | "denied" | "pending";

interface SettingState {
  sessionReplyPermissionStatus: SessionReplyPermissionStatus;
  setSessionReplyPermissionStatus: (
    status: SessionReplyPermissionStatus
  ) => void;
}

export const useSettingStore = create<SettingState>()(
  persist(
    immer((set, get) => ({
      sessionReplyPermissionStatus: "pending",
      setSessionReplyPermissionStatus: (status) => {
        set({ sessionReplyPermissionStatus: status });
      },
    })),
    {
      name: "setting-storage", // name of the item in the storage (must be unique)
      storage: zustandStorage, // (optional) by default, 'localStorage' is used
    }
  )
);

export function useSetting(key: string) {
  const [value, setValue] = React.useState(() => Settings.get(key));
  React.useEffect(() => {
    let isMounted = true;
    const callback = Settings.watchKeys(key, () => {
      if (isMounted) {
        setValue(Settings.get(key));
      }
    });
    return () => {
      Settings.clearWatch(callback);
      isMounted = false;
    };
  }, [key]);

  return [
    value,
    (value) => {
      Settings.set({ [key]: value });
      setValue(value);
    },
  ];
}
