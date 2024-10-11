// import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Auth from "../authentication/layout";
import Signup from "../authentication/signup";
import Signin from "../authentication/signin";
// Lazy load your components
// const Auth = lazy(() => import("../authentication/layout"));
// const Signup = lazy(() => import("../authentication/signup"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Auth />,
    children: [
      { path: "", element: <Signin /> },
      { path: "signup", element: <Signup /> },
      { path: "signin", element: <Signin /> },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      { path: "", element: <Signin /> },
      { path: "signup", element: <Signup /> },
      { path: "signin", element: <Signin /> },
    ],
  },
];

export default routes;
