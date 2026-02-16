import { Button } from "../components/ui/button";
import { Field, FieldDescription, FieldLabel } from "../components/ui/field";
import { Input } from "../components/ui/input";
import useAuthStore from "../store/useAuthStore";

export default function CreateMonitors() {
  const { user } = useAuthStore();
  return (
    <div className=" h-full flex flex-col px-30 font-montserrat gap-8">
      <h1 className="text-3xl font-semibold">Create Monitor</h1>

      <Field>
        <FieldLabel htmlFor="input-field-username">Name of Monitor</FieldLabel>
        <Input
          id="input-field-username"
          type="text"
          placeholder="Website Name"
          value={""}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="input-field-username">URL to monitor</FieldLabel>
        <Input
          id="input-field-username"
          type="url"
          value={"https://"}
          className="w-44"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="input-field-username">Email</FieldLabel>
        <Input
          id="input-field-username"
          type="text"
          value={user?.email}
          className="w-44 "
        />
        <FieldDescription>
          who's going to be notified and how when an incident occurs.
        </FieldDescription>
      </Field>

      <Button className="w-42" size={"lg"} variant="default">
        Create
      </Button>
    </div>
  );
}
