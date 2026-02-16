import { useRef } from "react";
import { Button } from "../components/ui/button";
import { Field, FieldDescription, FieldLabel } from "../components/ui/field";
import { Input } from "../components/ui/input";
import useAuthStore from "../store/useAuthStore";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateMonitors() {
  const urlRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const createMonitor = async () => {
    const name = nameRef.current?.value;
    const url = urlRef.current?.value;
    const email = emailRef.current?.value;

    if (!name || !url || !email) {
      console.log("all field are required");
      toast.error("All fields are required!", { position: "bottom-right" });
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/monitor/add`,
        {
          data: {
            name,
            url,
            email,
          },
        },
        { withCredentials: true },
      );

      if (response.status === 200) {
        console.log("added response", response.data);
        navigate("/dashboard/monitors");
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.log("error !", error);
    }
  };

  return (
    <div className=" h-full flex flex-col px-30 font-montserrat gap-8 ">
      <h1 className="text-3xl font-bold">Create Monitor</h1>

      <Field className="w-2xl">
        <FieldLabel htmlFor="input-field-username">Name of Monitor</FieldLabel>
        <Input
          id="input-field-username"
          type="text"
          placeholder="Website Name"
          ref={nameRef}
        />
      </Field>

      <Field className="w-2xl">
        <FieldLabel htmlFor="input-field-username">URL to monitor</FieldLabel>
        <Input
          id="input-field-username"
          type="url"
          defaultValue={"https://"}
          ref={urlRef}
        />
      </Field>

      <Field className="w-2xl">
        <FieldLabel htmlFor="input-field-username">Email</FieldLabel>
        <Input
          id="input-field-username"
          type="email"
          defaultValue={user?.email}
          className="w-44 "
          ref={emailRef}
        />
        <FieldDescription>
          who's going to be notified and how when an incident occurs.
        </FieldDescription>
      </Field>

      <Button
        onClick={() => createMonitor()}
        className="w-60 cursor-pointer"
        size={"lg"}
        variant="default"
      >
        Create
      </Button>
    </div>
  );
}
