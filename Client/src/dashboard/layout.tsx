import { Outlet } from "react-router-dom";
import Header from "./components/header";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
}
