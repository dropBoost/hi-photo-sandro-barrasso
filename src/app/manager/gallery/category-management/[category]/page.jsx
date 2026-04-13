"use client";

import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import YouTubePlayer from "@/components/youtubePlayer";
import DeleteSingleRecordButton from "@/components/deleteRecord/DeleteSingleRecordButton";
import FormUpdateCategory from "@/components/updateCategory/FormUpdateCategory";

export default function PAGEcategory() {

  const params = useParams();
  const category = params.category;
  const [update, setUpdate] = useState(0);
  const [categoryData, setCategoryData] = useState({});
  const [photo, setPhoto] = useState([]);
  const [video, setVideo] = useState([]);
  const [errorCategory, setErrorCategory] = useState(null);
  const [errorPhoto, setErrorPhoto] = useState(null);
  const [errorVideo, setErrorVideo] = useState(null);

  const BUCKET = "photogallery";

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function fetchCategoryData() {
      setErrorCategory(null);

      const { data, error } = await supabase
        .from("category")
        .select("*")
        .eq("id", category)
        .maybeSingle();

      if (error) {
        setErrorCategory(error.message);
        setCategoryData(null);
      } else {
        setCategoryData(data);
      }
    }

    if (category) {
      fetchCategoryData();
    }
  }, [category]);
  
  return (
    <div className="flex flex-col items-start justify-start gap-4 bg-neutral-200 font-sans dark:bg-neutral-950 w-full h-full p-5">
      <div className="flex flex-row items-center gap-3 w-full">
        <span>CATEGORY {category} </span>
      </div>

      <div className="flex flex-col justify-start bg-neutral-200 font-sans dark:bg-neutral-900 w-full h-full p-5 rounded-xl">
        <h3 className="text-white">{categoryData?.alias}</h3>
        <p className="text-red-500 text-sm">{errorCategory}</p>
      </div>
      <FormUpdateCategory category={categoryData}/>
    </div>
  );
}