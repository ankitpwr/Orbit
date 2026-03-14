import React, { useRef } from "react";
import { Field, FieldDescription, FieldLabel } from "../components/ui/field";
import { Input } from "../components/ui/input";
import useAuthStore from "../store/useAuthStore";
import { Button } from "../components/ui/button";
import useSettingStore from "../store/useSettingStore";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user } = useAuthStore();
  const nameRef = useRef<HTMLInputElement | null>(null);
  const { updateUserSetting } = useSettingStore();

  async function saveChange() {
    if (!nameRef.current) return;
    await updateUserSetting(nameRef.current.value);
    window.location.reload();
  }

  return (
    <div className="w-full h-full flex flex-col px-30 pt-20 font-montserrat gap-10">
      <div className="flex">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="flex flex-col gap-6">
        <Field className="flex flex-col gap-1 max-w-2xl">
          <FieldLabel htmlFor="input-field-username">Username</FieldLabel>
          <Input
            ref={nameRef}
            id="input-field-username"
            type="text"
            defaultValue={user!.name}
          />
        </Field>

        <Field className="flex flex-col gap-1 max-w-2xl">
          <FieldLabel htmlFor="input-field-username">Email</FieldLabel>
          <Input
            id="input-field-username"
            type="email"
            defaultValue={user!.email}
            disabled
          />
        </Field>

        <Field className="flex flex-col gap-1 max-w-2xl">
          <FieldLabel htmlFor="input-field-username">Created at</FieldLabel>
          <Input
            id="input-field-username"
            type="text"
            defaultValue={new Date(user!.createdAt).toLocaleDateString(
              "en-In",
              {
                dateStyle: "long",
              },
            )}
            disabled
          />
        </Field>
      </div>

      <Button onClick={() => saveChange()} className="max-w-60" size={"lg"}>
        Save changes
      </Button>
    </div>
  );
}
