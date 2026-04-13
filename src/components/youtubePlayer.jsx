"use client";

import YouTube from "react-youtube";

function getYoutubeId(url) {
  const regExp =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/;

  const match = url?.match(regExp);
  return match ? match[1] : null;
}

export default function YouTubePlayer({ link }) {
  const videoId = getYoutubeId(link);

  if (!videoId) return null;

  return (
    <div className="w-full aspect-video">
      <YouTube
        videoId={videoId}
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 0,
            controls: 0,
            rel: 0,
            fs: 0,
            playsinline: 1,
          },
        }}
        className="w-full h-full"
      />
    </div>
  );
}