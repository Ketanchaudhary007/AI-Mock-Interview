"use client";
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

function Header() {
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log(path);
  }, [path]);

  const navigateTo = (route) => {
    router.push(route);
  };

  return (
    <div className="flex p-1 items-center justify-between bg-gray-900 shadow-sm">
      <Image src="/Logo1.png" width={160} height={100} alt="logo" />
      <ul className="hidden md:flex gap-6 text-white text-xl">
        <li
          onClick={() => navigateTo('/dashboard')}
          className={`hover:text-cyan-500 hover:font-bold transition-all cursor-pointer ${
            path == '/dashboard' && 'text-cyan-500 font-bold'
          }`}
        >
          Dashboard
        </li>
        <li
          // onClick={() => navigateTo('/dashboard/questions')}
          className={`hover:text-cyan-500 hover:font-bold transition-all cursor-pointer ${
            path == '/dashboard/questions' && 'text-cyan-500 font-bold'
          }`}
        >
          Questions
        </li>
        <li
          // onClick={() => navigateTo('/dashboard/upgrade')}
          className={`hover:text-cyan-500 hover:font-bold transition-all cursor-pointer ${
            path == '/dashboard/upgrade' && 'text-cyan-500 font-bold'
          }`}
        >
          Upgrade
        </li>
        <li
          // onClick={() => navigateTo('/dashboard/how')}
          className={`hover:text-cyan-500 hover:font-bold transition-all cursor-pointer ${
            path == '/dashboard/how' && 'text-cyan-500 font-bold'
          }`}
        >
          How it works?
        </li>
      </ul>
      <div className="mr-4">
        <UserButton />
      </div>
    </div>
  );
}

export default Header;
