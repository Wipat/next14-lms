"use client"

import { UserButton } from '@clerk/nextjs'
import MobileSidebar from './mobile-sidebar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { SearchInput } from '@/components/search-input'
import NavbarRoutes from '@/components/navbar-routes'

const Navbar = () => {

  const pathname = usePathname()

  const isDashboardPage = pathname === "/"

  return (
    <div className='flex items-center p-4 h-full bg-white'>
        {isDashboardPage && (
          <div className='hidden md:block'>
            <SearchInput/>
          </div>
        )}
        <MobileSidebar/>
        <NavbarRoutes/>
    </div>
  )
}

export default Navbar