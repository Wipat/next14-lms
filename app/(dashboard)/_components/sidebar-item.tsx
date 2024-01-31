"use client"

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

interface SidebarItemProps {
    label : string
    href : string
    icon : LucideIcon
}

const SidebarItem = ({
    label,
    href,
    icon : Icon
} : SidebarItemProps ) => {

    const pathname = usePathname()
    const router = useRouter()

    const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`)

    const onClick = () => {
        router.push(href)
    }

  return (

    <button
        type="button"
        onClick={onClick}
        className={cn(
            "flex items-center pl-6 text-slate-500 font-[500] transition-all hover:text-slate-600 hover:bg-slate-300/20",
            isActive && "text-sky-700 bg-sky-200/20 hover:text-sky-700 hover:bg-sky-200/20"
        )}
    >
        <div className="flex items-center py-4 gap-x-3">
            <Icon
                size={22}
            />
            {label}
        </div>
        <div
            className={cn(
                "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
                isActive && "opacity-100"
            )}
        />
    </button>

  )
}

export default SidebarItem