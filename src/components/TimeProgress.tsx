import React, { useCallback, useEffect, useState } from "react";

export default function TimeProgress({
  videoRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
}) {
  const [progression, setProgression] = useState(0);

  const updateCurrentTime = useCallback(() => {
    if (videoRef.current) {
      setProgression(
        Math.floor(
          (videoRef.current.currentTime / videoRef.current.duration) * 100
        )
      );
    }
  }, [setProgression, videoRef]);

  useEffect(() => {
    const videoElt = videoRef.current;
    videoElt?.addEventListener("timeupdate", updateCurrentTime);

    return () => {
      videoElt?.removeEventListener("timeupdate", updateCurrentTime);
    };
  }, [updateCurrentTime, videoRef]);

  return (
    <progress
      value={progression}
      max="100"
      className="transition-all duration-300 absolute bottom-0 h-[2px] mb-0 w-full bg-gray-400/80"
    ></progress>
  );
}
