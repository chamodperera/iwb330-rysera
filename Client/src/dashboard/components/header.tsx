import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"



const Header: React.FC = () => {
    return (
        <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-base font-semibold lg:text-xl">Rysera - 3D Printing</h1>
          <div className="flex items-center gap-4">
            <button className="hover:text-gray-900 bg-neutral-200">View Orders</button>
            <Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
          </div>
        </div>
      </header>
    );
};

export default Header;