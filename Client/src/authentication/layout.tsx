import { Outlet } from "react-router-dom";
import model from "@/assets/images/3dmodel.svg";

export default function AuthLayout() {
  return (
    <div className="flex h-screen">
      {/* Left column */}
      <div className="relative hidden w-1/2 bg-primary lg:block">
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <div className="text-2xl font-semibold">Rysera - 3D Printing</div>
          <img
            src={model}
            alt="3D printed lattice structure"
            className="opacity-50 max-h-96"
          />
          <div className="max-w-lg">
            <p className="text-md">
              "Welcome to RYSERA 3D Printing. We specialize in custom 3D
              printing services tailored to your unique needs."
            </p>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="flex w-full flex-col justify-between px-10 md:px-20 pt-10 pb-5 lg:w-1/2 xl:w-3/4">
        <Outlet />
        <div className="text-center text-sm text-muted-foreground">
          &copy; 2024 Rysera Innovations. All rights reserved.
        </div>
      </div>
    </div>
  );
}
