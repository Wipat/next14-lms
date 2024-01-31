"use client"

import { GraduationCap, Layout } from "lucide-react"

import SidebarItem from "./sidebar-item"

const guestRoutes = [
    {
        label : 'Dashboard',
        icon : Layout,
        href : '/'
    },
    {
        label : 'Courses',
        icon : GraduationCap,
        href : '/teacher/courses'
    },

]

const SidebarRoutes = () => {

return (
    <div className="flex flex-col w-full">
        {guestRoutes.map((route) => (
            <SidebarItem
                key={route.href}
                label={route.label}
                icon={route.icon}
                href={route.href}
            />
        ))}
    </div>
  )
}

export default SidebarRoutes