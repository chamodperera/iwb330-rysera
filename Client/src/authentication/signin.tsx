import GoogleButton from "@/components/googleButton";
import { Link } from "react-router-dom";

export default function Signin() {
  return (
    <>
      <div className="flex justify-end">
        <Link
          className="font-medium hover:underline text-muted-foreground text-base"
          to="/auth/signup"
        >
          Create an Account
        </Link>
      </div>
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Login to your Account
          </h1>
          <p className="text-muted-foreground">
            Login to your account to continue using our services
          </p>
        </div>
        <div className="relative flex items-center py-5">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-muted-foreground text-sm font-medium">
            CONTINUE WITH
          </span>
          <div className="flex-grow border-t border-border"></div>
        </div>
        <div className="space-y-4">
          <GoogleButton />
        </div>
        <div className="text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <a className="underline text-muted-foreground" href="#">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="underline text-muted-foreground" href="#">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </>
  );
}
