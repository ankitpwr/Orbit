import { create } from "zustand";
import type { StateCreator } from "zustand";
import type { SettingActions, SettingState } from "../lib/types";
import axios from "axios";
import { toast } from "sonner";

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
      } else {
        toast.error(response.data.error, { position: "bottom-right" });
      }
    } catch (error) {
      console.log("error ", error);
      toast.error("Something went wrong", { position: "bottom-right" });
    }
  },
});

const useSettingStore = create<SettingStoreType>(SettingStore);
export default useSettingStore;
