import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function Monitors() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex px-30 font-montserrat">
      <div className="w-full flex justify-between bg-amber-300">
        <h1 className="text-3xl font-semibold">Monitors</h1>
        <Button
          variant={"default"}
          size={"lg"}
          onClick={() => navigate("/dashboard/monitors/new")}
        >
          {" "}
          Create monitor
        </Button>
      </div>
    </div>
  );
}
