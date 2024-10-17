import { Link, Outlet } from "react-router-dom";

export default function Signup() {
  return (
    <>
      <div className="flex justify-end">
        <Link
          className="font-medium hover:underline text-muted-foreground text-base"
          to="/auth/signin"
        >
          Login
        </Link>
      </div>
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Create an account
          </h1>
          <p className="text-muted-foreground">
            Creating an account will help use to deliver an amazing service
          </p>
        </div>

        <Outlet />
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
