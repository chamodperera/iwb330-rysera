import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UseUser } from "@/userContext";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import { useNavigate, useLocation } from "react-router-dom";
=======
import { useNavigate , useLocation } from "react-router-dom";
>>>>>>> 22d2b7a45f15cf1a9a1fe9fa56ea138864140552

const Header: React.FC = () => {
  const { user } = UseUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [buttonText, setButtonText] = useState("View Orders");

<<<<<<< HEAD
  const handleButtonClick = () => {
    if (location.pathname === "/dashboard/orders") {
      navigate("/dashboard");
    } else {
      navigate("/dashboard/orders");
=======
  useEffect(() => {
    if (location.pathname === "/dashboard/orders") {
      setButtonText("Dashboard");
    } else {
      setButtonText("View Orders");
>>>>>>> 22d2b7a45f15cf1a9a1fe9fa56ea138864140552
    }
  }, [location.pathname]);

  const handleButtonClick = () => {
    if (location.pathname === "/dashboard/orders") {
      navigate("/dashboard");
    } else {
      navigate("/dashboard/orders");
    }
  };

  useEffect(() => {
    if (location.pathname === "/dashboard/orders") {
      setButtonText("Dashboard");
    } else {
      setButtonText("View Orders");
    }
  }, [location.pathname]);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-base font-semibold lg:text-xl">
          Rysera - 3D Printing
        </h1>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <Button
                className="bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800"
                onClick={handleButtonClick}
              >
                {buttonText}
              </Button>
              <Avatar>
                <AvatarImage src={user.avatar} referrerPolicy="no-referrer" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
