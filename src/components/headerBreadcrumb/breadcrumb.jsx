'use client'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { usePathname } from "next/navigation"
import { ToggleDarkMode } from "../ui/toggle-dark-mode"

export default function BreadcrumbCOMP ({label}) {

  const path = usePathname()
  const labelPath = path.split("/").filter(Boolean)

  return (

    <div className="flex items-center justify-between gap-2 px-4">
      <div className="flex items-center gap-2">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage className={`text-xs`}>{label ? label : labelPath.join(" / ")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      </div>
      <ToggleDarkMode/>
    </div>
  )
}