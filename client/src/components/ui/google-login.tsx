import { Button } from "./button";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function GoogleLogin() {
  const responseGoogle = async (authResult: any) => {
    try {
      if (!authResult.code) {
        console.log("not auth code");
        return;
      }
      console.log(
        "url is ",
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google`,
      );

      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google`,
        {
          code: authResult.code,
        },
      );

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  async function checkStatus() {
    try {
      const response = await axios.get("https://zod.dev", { timeout: 5000 });
      console.log(response.status);
    } catch (error) {
      console.log(error);
    }
  }
  checkStatus();
  const login = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
  return (
    <div className="w-screen h-screen  flex justify-center items-center ">
      <Button onClick={login}>signup</Button>
    </div>
  );
}
