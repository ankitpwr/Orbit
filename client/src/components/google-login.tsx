import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function GoogleLogin() {
  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();
  const responseGoogle = async (authResult: any) => {
    try {
      if (!authResult.code) {
        return;
      }

      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/google`,
        {
          code: authResult.code,
        },
        { withCredentials: true },
      );
      if (result.status == 200) {
        await checkAuth();
        navigate("/dashboard/monitors");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
  return (
    <div className="flex justify-center items-center gap-4 ">
      <Button onClick={() => login()} variant="secondary">
        Signup
      </Button>
      <Button
        className="bg-[#b7c4ff] text-black hover:bg-[#a6b5f5] px-4"
        onClick={() => login()}
        variant={"default"}
      >
        Get Started
      </Button>
    </div>
  );
}
