import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { toast } from "sonner";

export default function GoogleLogin() {
  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const responseGoogle = async (authResult: any) => {
    if (!authResult.code) {
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/google`,
        {
          code: authResult.code,
        },
        { withCredentials: true },
      );
      if (result.status == 200) {
        await checkAuth();
        toast.success(result.data.message, { position: "bottom-right" });
        navigate("/dashboard/monitors");
      } else {
        toast.error(result.data.error, { position: "bottom-right" });
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to sign in with Google. Please try again.", {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  const handleLogin = () => {
    if (!loading) {
      login();
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 ">
      <Button onClick={handleLogin} variant="secondary" disabled={loading}>
        {loading && <Spinner data-icon="inline-start" />}
        Signup
      </Button>
      <Button
        className="bg-[#b7c4ff] text-black hover:bg-[#a6b5f5] px-4"
        onClick={handleLogin}
        variant={"default"}
        disabled={loading}
      >
        {loading && <Spinner data-icon="inline-start" />}
        Get Started
      </Button>
    </div>
  );
}
