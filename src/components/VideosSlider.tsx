import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import YtVideoWidget, { Video, YtVideoWidgetRef } from "./YtVideoWidget";
import { useCallback, useRef, useState } from "react";

export default function VideosSlider({ videos }: { videos: Video[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoMapRefs = useRef<Map<number, YtVideoWidgetRef>>(new Map());

  const handleNext = useCallback(() => {
    if (currentIdx < videos.length - 1) {
      scrollBy({
        top: 765,
        behavior: "smooth",
      });
      videoMapRefs.current?.get(currentIdx)?.pauseVideo();
      videoMapRefs.current?.get(currentIdx + 1)?.playVideo();
      setCurrentIdx((idx) => idx + 1);
    }
  }, [currentIdx, videos.length]);

  const handlePrev = useCallback(() => {
    if (currentIdx > 0) {
      scrollBy({
        top: -765,
        behavior: "smooth",
      });
      videoMapRefs.current?.get(currentIdx)?.pauseVideo();
      videoMapRefs.current?.get(currentIdx - 1)?.playVideo();
      setCurrentIdx((idx) => idx - 1);
    }
  }, [currentIdx]);

  return (
    <div
      ref={containerRef}
      className="w-screen min-h-screen bg-black items-center flex flex-col gap-5 py-5 transition-transform duration-300 ease-in-out"
    >
      {videos.map((video, index) => (
        <YtVideoWidget
          ref={(ref) => {
            if (ref) {
              videoMapRefs.current.set(index, ref);
            }
          }}
          video={video}
          key={index}
          onVideoEnd={handleNext}
        />
      ))}

      <div className="fixed right-0 top-0 bottom-0 flex flex-col justify-between p-5">
        <button
          onClick={handlePrev}
          className="text-white text-3xl bg-white/20 hover:bg-white/30 flex items-center justify-center w-14 h-14 rounded-full"
        >
          <MdArrowUpward />
        </button>
        <button
          onClick={handleNext}
          className="text-white text-3xl bg-white/20 hover:bg-white/30 flex items-center justify-center w-14 h-14 rounded-full"
        >
          <MdArrowDownward />
        </button>
      </div>
    </div>
  );
}
