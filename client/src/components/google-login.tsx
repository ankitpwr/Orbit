import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Button } from "./ui/button";

export default function GoogleLogin() {
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
