'use client'

import Image from "next/image";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import BooleanSwitchCell from "@/components/updateSwitch/BooleanSwitchCell";
import DeleteCategoryButton from "@/components/deleteCategory/DeleteCategoryButton";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function COMPListCategory() {

  const [category, setCategory] = useState([])
  const [update, setUpdate] = useState(0)
  const [errCategory, setErrCategory] = useState([])
  const url = usePathname()
  const BUCKET = "assets"

  useEffect(() => {

    const supabase = createSupabaseBrowserClient();

    async function fetchCategory() {

      setErrCategory(null);

      const { data, error } = await supabase
      .from("category")
      .select("id, alias, color, img_cover, active")
      .order("id", { ascending: true });

      if (error) {
        setErrCategory(error.message);
        setCategory(null);
      } else {
        setCategory(data);
      }
    }

    fetchCategory();

  }, [update]);

  function publicUrl(path) {
    if (!path) return null;
    const domain = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!domain) return null;
    return `${domain}/storage/v1/object/public/${BUCKET}/${path}`;
  }


  return (
    <div className="h-full">
      <div className="grid xl:grid-cols-4 grid-cols-2 gap-3">
      {category?.map((cat) => {
        return (
          <div key={cat.id} className="flex flex-col items-center border rounded-2xl w-full gap-4 p-5 text-sm">
            <div className="flex flex-row items-center justify-end gap-2 w-full">
                  <BooleanSwitchCell
                    tableName="category"
                    idColumn="id"
                    idValue={cat.id}
                    fieldName="active"
                    initialValue={cat.active}
                  />
            </div>
            <div className="w-full border">
              {cat.img_cover ? (
                <Image
                  src={`${publicUrl(cat.img_cover)}`}
                  alt={cat.alias || "Cover categoria"}
                  width={500}
                  height={70}
                  className="object-cover aspect-video"
                />
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
            <div className="flex flex-row items-center justify-start gap-2 w-full rounded-lg ">
              <span className="font-bold"><span className="font-extralight">id:</span>  {cat.id}</span>
              <span className="font-bold"><span className="font-extralight">alias:</span> {cat.alias}</span>
            </div>
            <div className="flex flex-row items-center justify-start gap-2 w-full border p-2 rounded-lg" style={{ borderColor: cat.color }}>
              <span className="font-bold"><span className="font-extralight">colore:</span> {cat.color || "-"}</span>
              {cat.color ? (
                <div
                  className="h-5 flex-1 rounded border"
                  style={{ backgroundColor: cat.color }}
                />
              ) : null}
            </div>
            <div className="flex flex-row items-center justify-end gap-2 w-full">
              <Link href={`${url}/${cat.id}`} className="flex items-center text-xs justify-center bg-cyan-900 rounded-sm h-full aspect-square">
                <FaPencilAlt />
              </Link>
              <DeleteCategoryButton id={cat.id} setUpdate={setUpdate}/>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}