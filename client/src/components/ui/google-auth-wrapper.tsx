import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import GoogleLogin from "./google-login";

export default function GoogleAuthWrapper() {
  const id = import.meta.env.VITE_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={`${id}`}>
      <GoogleLogin />
    </GoogleOAuthProvider>
  );
}
