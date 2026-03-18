import React, { useRef, useState, type JSX } from "react";
import { Field, FieldDescription, FieldLabel } from "../components/ui/field";
import { Input } from "../components/ui/input";
import useAuthStore from "../store/useAuthStore";
import { Button } from "../components/ui/button";
import useSettingStore from "../store/useSettingStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Timezones } from "../lib/timezone";

export default function Settings() {
  const { user } = useAuthStore();
  const [timezone, setTimezone] = useState<string | undefined>(user?.timezone);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const { updateUserSetting } = useSettingStore();

  async function saveChange() {
    if (!nameRef.current || timezone == undefined) return;
    console.log("timezone is ", timezone);
    await updateUserSetting(nameRef.current.value, timezone);
    window.location.reload();
  }

  return (
    <div className="w-full h-full flex flex-col md:px-30 md:pt-20 px-5 py-10 font-montserrat gap-10">
      <div className="flex">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="flex flex-col gap-6">
        <Field className="flex flex-col gap-1 md:w-xl">
          <FieldLabel htmlFor="input-field-username">Username</FieldLabel>
          <Input
            ref={nameRef}
            id="input-field-username"
            type="text"
            defaultValue={user!.name}
          />
        </Field>

        <Field className="flex flex-col gap-1 md:w-xl">
          <FieldLabel htmlFor="input-field-username">Email</FieldLabel>
          <Input
            id="input-field-username"
            type="email"
            defaultValue={user!.email}
            disabled
          />
        </Field>

        <Field className="flex flex-col gap-1 md:w-xl">
          <FieldLabel htmlFor="input-field-username">Created at</FieldLabel>
          <Input
            id="input-field-username"
            type="text"
            defaultValue={new Date(user!.createdAt).toLocaleDateString(
              "en-In",
              {
                timeZone: user?.timezone,
                dateStyle: "long",
              },
            )}
            disabled
          />
        </Field>

        <Field className="flex flex-col gap-1 max-w-2xl">
          <FieldLabel htmlFor="input-field-username">Timezone</FieldLabel>
          <Select onValueChange={(value) => setTimezone(value)}>
            <SelectTrigger className="w-full max-w-64">
              <SelectValue placeholder={user?.timezone} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {" "}
                {Timezones.map((z, index) => (
                  <SelectItem key={index} value={z}>
                    {z}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Button onClick={() => saveChange()} className="max-w-60" size={"lg"}>
        Save changes
      </Button>
    </div>
  );
}
