"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'

import { Button } from '@/components/ui/button'

const NavbarRoutes = () => {

    const pathname = usePathname()
    const notCoursePage = pathname !== "/teacher/courses"

    return (
        <div className='ml-auto flex items-center space-x-2'>
            {notCoursePage && (
                <Link href="/teacher/courses">
                    <Button>
                        <LogOut className='w-4 h-4 mr-2' />
                        Courses
                    </Button>
                </Link>
            )}
            <UserButton />
        </div>
    )
}

export default NavbarRoutes