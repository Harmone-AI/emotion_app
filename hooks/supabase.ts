import { createClient } from "@supabase/supabase-js";
import { storage } from "./storage";

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: {
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
      },
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
