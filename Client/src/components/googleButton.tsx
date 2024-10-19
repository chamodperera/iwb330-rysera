import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import { handleLogin } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { User } from "@/types";
import { UseUser } from "../userContext";

export default function GoogleButton() {
  const { setUser } = UseUser();
  const navigate = useNavigate();
  const handleSuccess = async (response: CredentialResponse) => {
    // Extract token from response
    const token = response.credential;
    if (token) {
      // Save the token in session storage
      sessionStorage.setItem("googleAuthToken", token);
    } else {
      console.error("Token not found in response");
    }

    // Call the backend Google login function
    const user: User | null = await handleLogin();

    console.log("user", user);
    // Redirect the user to the appropriate page
    if (!user) {
      navigate("/auth/signup/register");
    } else {
      setUser(user);
      navigate("/dashboard");
    }
  };

  const handleError = () => {
    console.error("Google login failed");
  };

  return (
    <>
      <div className="relative flex items-center py-5">
        <div className="flex-grow border-t border-border"></div>
        <span className="flex-shrink mx-4 text-muted-foreground text-sm font-medium">
          CONTINUE WITH
        </span>
        <div className="flex-grow border-t border-border"></div>
      </div>
      <div className="space-y-4">
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}
        >
          <div className="flex justify-center text-base">
            <GoogleLogin
              text="continue_with"
              onSuccess={handleSuccess} // Handle the successful login
              onError={handleError} // Handle errors during login
            />
          </div>
        </GoogleOAuthProvider>
      </div>
    </>
  );
}
