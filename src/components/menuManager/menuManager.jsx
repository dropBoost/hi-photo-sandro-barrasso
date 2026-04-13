'use client'

import { navManager } from "@/app/settings";
import { Separator } from "../ui/separator";
import Link from "next/link";

export default function COMPmenuManager () {

  return (
    <>
    <div className="flex flex-col gap-5">
      {navManager && navManager.map((m, i) => {
        return (
          <div key={i} className="flex flex-col gap-2 p-5 rounded-lg bg-neutral-900">
            <span className="flex flex-row items-center gap-1 uppercase font-medium">
            {m.icon()}{m.title}
            </span>
            <Separator/>
            <div className="flex flex-wrap gap-1">
              {m.items && m.items.map((items, i) => {
                return (
                  <Link href={items.url} key={i+1} className="px-3 py-1 rounded-lg hover:bg-muted text-xs truncate bg-neutral-950">
                    {items.title}
                  </Link>
                )
              })}
            </div>  
          </div>
        )
      })}
    </div>
    </>
  )
}