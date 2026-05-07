import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-2 ">
      <h1 className="text-8xl">404</h1>
      <span>Page Not Found</span>
      <Button onClick={() => navigate("/")} variant={"secondary"}>
        Redirect
      </Button>
    </div>
  );
}
