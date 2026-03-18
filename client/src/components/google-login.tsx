import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export default function GoogleLogin() {
  const navigate = useNavigate();
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
    <div className="w-screen h-screen  flex justify-center items-center ">
      <Button onClick={() => login()}>signup</Button>
    </div>
  );
}
