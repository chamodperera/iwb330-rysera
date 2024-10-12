import React from 'react';
import user from '../assets/user.png';
import { Button } from "../components/ui/button";

const Header: React.FC = () => {
    return (
            <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-black">
                    Rysera-3D Printing
                </span>
                <div className="flex items-center font-bold">
                    <Button variant="secondary" className='bg-neutral-200 text-black'>View Orders</Button>
                    <img 
                        alt="User Profile" 
                        src={user} 
                        className="ml-10 w-10 h-10 rounded-full" 
                    />
                </div>
            </div>
    );
};

export default Header;