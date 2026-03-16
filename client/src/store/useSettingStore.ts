import { create } from "zustand";
import type { StateCreator } from "zustand";
import type { SettingActions, SettingState } from "../lib/types";
import axios from "axios";

type SettingStoreType = SettingActions & SettingState;

const SettingStore: StateCreator<SettingStoreType> = (set) => ({
  updating: false,
  updateUserSetting: async (name: string, timezone: string) => {
    set({ updating: true });
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/user/update-user-details`,
        {
          name: name,
          timezone: timezone,
        },
        { withCredentials: true },
      );

      if (response.status == 200) {
        console.log(response.data);
      }
    } catch (error) {
      console.log("error ", error);
    }
  },
});

const useSettingStore = create<SettingStoreType>(SettingStore);
export default useSettingStore;
