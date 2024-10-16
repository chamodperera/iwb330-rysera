import { RouteObject } from "react-router-dom";
import Auth from "../authentication/layout";
import Signup from "../authentication/signup";
import Signin from "../authentication/signin";
import Home from "@/home/home";
import Dashboard from "@/dashboard/dashboard";
import DashboardLayout from "@/dashboard/layout";
import { Orders } from "@/dashboard/orders";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "main", element: <Dashboard /> },
      { path: "orders", element: <Orders /> },
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
