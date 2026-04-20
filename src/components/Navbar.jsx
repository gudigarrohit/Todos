"use client";

import Image from "next/image";

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center bg-gradient-to-r from-indigo-600 via-purple-600 to-black text-white py-4 md:px-8 px-3 shadow-lg">

            {/* Logo */}
            <div className="logo font-extrabold text-2xl tracking-wide">
                <span className="cursor-pointer  transition-colors hover:text-violet-300">
                    iTask Manager
                </span>
            </div>

            {/* Right Side */}
            <ul className="flex items-center space-x-3 font-medium">

                {/* Avatar */}
                <li className="cursor-pointer">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white hover:scale-105 transition">
                        <Image
                            src="/avatar.jpeg"
                            alt="User Avatar"
                            fill
                            className="object-cover"
                        />
                    </div>
                </li>

                {/* My Task */}
                <li className="cursor-pointer relative group font-bold  transition-colors">
                    My Task
                </li>

            </ul>
        </nav>
    );
};

export default Navbar;