"use client"
import { NavbarProps } from '@/types/type'
import React, { memo } from 'react'
import Image from 'next/image'
import ActiveUsers from './users/ActiveUsers'

const Navbar = ({activeElement}: NavbarProps) => {
  // const isActive = (value: string | Array<ActiveElement>） =>
  //(activeElement && activeElement.value === value) ||
  // (Array.isArray(value) && value.some((val) = val?.activeElement?. value));
  // {activeElement}: NavbarProps 
  return (
    <nav className='flex select-none items-center justify-between gap-4 bg-primary-black px-5 text-white'>
      <Image 
        src="/assets/logo.svg"
        alt="Parallel Draw Logo"
        width={58}
        height={20}
      />
      <ActiveUsers />
    </nav>
  );
};

export default memo(Navbar, (prevProps, nextProps) => prevProps.activeElement === nextProps.activeElement);