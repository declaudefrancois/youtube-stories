import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import YtVideoWidget, { Video, YtVideoWidgetRef } from "./YtVideoWidget";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Prevent strange behavior when multiple wheel event are triggered.
 */
let canScroll = true;

export default function VideosSlider({ videos }: { videos: Video[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoMapRefs = useRef<Map<number, YtVideoWidgetRef>>(new Map());

  const handleNext = useCallback(() => {
    if (currentIdx < videos.length - 1) {
      videoMapRefs.current?.get(currentIdx)?.pauseVideo();
      videoMapRefs.current?.get(currentIdx)?.closeCommentSection();

      videoMapRefs.current?.get(currentIdx + 1)?.playVideo();
      videoMapRefs.current?.get(currentIdx + 1)?.scrollIntoView();

      setCurrentIdx((idx) => idx + 1);
    }
  }, [currentIdx, videos.length]);

  const handlePrev = useCallback(() => {
    if (currentIdx > 0) {
      videoMapRefs.current?.get(currentIdx)?.pauseVideo();
      videoMapRefs.current?.get(currentIdx)?.closeCommentSection();

      videoMapRefs.current?.get(currentIdx - 1)?.playVideo();
      videoMapRefs.current?.get(currentIdx - 1)?.scrollIntoView();

      setCurrentIdx((idx) => idx - 1);
    }
  }, [currentIdx]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!canScroll) return;

      canScroll = false;

      const deltaY = e.deltaY;
      const idTimeout = setTimeout(() => {
        if (deltaY > 0) {
          handleNext();
        } else {
          handlePrev();
        }

        canScroll = true;
        clearTimeout(idTimeout);
      }, 300);
    },
    [handleNext, handlePrev]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel);

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [containerRef, handleWheel]);

  useEffect(() => {
    videoMapRefs.current?.get(0)?.scrollIntoView();
    videoMapRefs.current?.get(0)?.playVideo();
  }, [videoMapRefs]);

  return (
    <div
      ref={containerRef}
      className="bg-black w-screen h-screen  overflow-hidden items-center flex flex-col gap-5 py-5 transition-transform duration-300 ease-in-out pb-[300px]"
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

      <div className="fixed right-0 flex justify-center top-0 bottom-0 w-20">
        {currentIdx > 0 ? (
          <button
            onClick={handlePrev}
            className="fixed top-3 text-white text-3xl bg-white/20 hover:bg-white/30 flex items-center justify-center w-14 h-14 rounded-full"
          >
            <MdArrowUpward />
          </button>
        ) : null}

        {currentIdx < videos.length - 1 ? (
          <button
            onClick={handleNext}
            className="fixed bottom-3 text-white text-3xl bg-white/20 hover:bg-white/30 flex items-center justify-center w-14 h-14 rounded-full"
          >
            <MdArrowDownward />
          </button>
        ) : null}
      </div>
    </div>
  );
}
