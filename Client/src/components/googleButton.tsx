import { Button } from "@/components/ui/button";
import googleIcon from "@/assets/icons/google.svg";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

const GoogleLogin = () => {
  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      console.log("Google Login Success:", response);
    },
    onError: () => {
      console.error("Google Login Failed");
    },
  });

  return (
    <Button
      className="w-full hover:border-black hover:bg-white border-border text-base gap-2"
      variant="outline"
      onClick={() => googleLogin()}
    >
      <img src={googleIcon} alt="Google icon" className="w-7 h-7 mr-2" />
      Google
    </Button>
  );
};

export default function GoogleButton() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
      <GoogleLogin />
    </GoogleOAuthProvider>
  );
}
