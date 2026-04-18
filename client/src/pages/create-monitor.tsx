import { useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Field, FieldDescription, FieldLabel } from "../components/ui/field";
import { Input } from "../components/ui/input";
import useAuthStore from "../store/useAuthStore";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../components/ui/spinner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validInterval, type IntervalType } from "@/lib/types";

interface Data {
  name: string;
  url: string;
  interval: IntervalType;
  primaryEmail: string;
  esacalationEmail1?: string;
  esacalationEmail2?: string;
}

export default function CreateMonitors() {
  const urlRef = useRef<HTMLInputElement | null>(null);
  const primaryEmailRef = useRef<HTMLInputElement | null>(null);
  const esacalationEmail1 = useRef<HTMLInputElement | null>(null);
  const esacalationEmail2 = useRef<HTMLInputElement | null>(null);

  const nameRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [interval, setInterval] = useState<IntervalType>(5);
  const { user } = useAuthStore();

  const createMonitor = async () => {
    setLoading(true);
    const name = nameRef.current?.value;
    const url = urlRef.current?.value;
    const primaryEmail = primaryEmailRef.current?.value;

    if (!name || !url || !primaryEmail) {
      if (!name)
        toast.error("Monitor name is required", { position: "bottom-right" });
      else if (!url)
        toast.error("Url is required", { position: "bottom-right" });
      else if (!primaryEmail)
        toast.error("Escalation 1 email is required", {
          position: "bottom-right",
        });
      setLoading(false);
      return;
    }
    const data: Data = {
      name: name,
      url: url,
      primaryEmail: primaryEmail,
      interval: interval,
    };

    if (
      esacalationEmail2.current?.value != "" &&
      !esacalationEmail1.current?.value
    ) {
      toast.error("Escalation email 1 is required before esacalation email 2");
      setLoading(false);
      return;
    }

    if (esacalationEmail1.current?.value) {
      data.esacalationEmail1 = esacalationEmail1.current.value;
      if (esacalationEmail2.current?.value) {
        data.esacalationEmail2 = esacalationEmail2.current.value;
      }
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/monitor/add`,
        data,
        { withCredentials: true },
      );

      if (response.status === 200) {
        navigate("/dashboard/monitors");
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.log("error !", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" h-full flex flex-col md:px-30 px-5 font-montserrat gap-8  ">
      <div>
        <Breadcrumb className="text-white">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/monitors">
                Monitors
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create monitor</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="text-3xl font-bold">Create Monitor</h1>

      <Field className="md:w-2xl  ">
        <FieldLabel htmlFor="input-field-username">
          Name of Monitor <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          className=""
          type="text"
          placeholder="Website Name"
          ref={nameRef}
        />
      </Field>

      <Field className="md:w-2xl">
        <FieldLabel htmlFor="input-field-username">
          URL to monitor <span className="text-destructive">*</span>
        </FieldLabel>
        <Input type="url" defaultValue={"https://"} ref={urlRef} />
      </Field>
      <Field className="flex flex-col gap-1 max-w-2xl">
        <FieldLabel htmlFor="input-field-username">
          Check Frequency (in minutes)
        </FieldLabel>
        <Select
          onValueChange={(value) => setInterval(Number(value) as IntervalType)}
        >
          <SelectTrigger className="w-full max-w-64">
            <SelectValue placeholder={5} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {" "}
              {validInterval.map((z, index) => (
                <SelectItem key={index} value={String(z)}>
                  {z}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field className="md:w-2xl">
        <FieldLabel
          className="flex flex-col items-start gap-2"
          htmlFor="input-field-username"
        >
          <h1 className="">Alerting & Escalation</h1>
        </FieldLabel>

        <div className="flex flex-col gap-6">
          <Field className="flex flex-col gap-1">
            <Input
              type="email"
              defaultValue={user?.email}
              className="w-44 "
              ref={primaryEmailRef}
            />
            <FieldDescription>
              {" "}
              Email escalation 1 (Immediately){" "}
              <span className="text-destructive">*</span>
            </FieldDescription>
          </Field>

          <Field className="flex flex-col gap-1">
            <Input
              type="email"
              className="w-44 "
              placeholder="Email"
              ref={esacalationEmail1}
            />
            <FieldDescription>
              Email escalation 2 (After 30 minutes of downtime){" "}
            </FieldDescription>
          </Field>

          <Field className="flex flex-col gap-1">
            <Input
              type="email"
              placeholder="Email"
              className="w-44 "
              ref={esacalationEmail2}
            />
            <FieldDescription>
              Email escalation 2 (After 60 minutes of downtime){" "}
            </FieldDescription>
          </Field>
        </div>
      </Field>

      <Button
        onClick={() => createMonitor()}
        className="bg-[#5b63d3] text-white hover:bg-[#7c87f7] w-60 cursor-pointer"
        size={"lg"}
        variant="default"
      >
        {loading && <Spinner data-icon="inline-start" />}
        Create
      </Button>
    </div>
  );
}
