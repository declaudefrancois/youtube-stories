import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { MdPause, MdPlayArrow, MdVolumeOff, MdVolumeUp } from "react-icons/md";
import TimeProgress from "./TimeProgress";
import YtActions from "./YtActions";

export type Video = {
  avatar: string;
  src: string;
  title: string;
  poster: string;
  channel: string;
};

export interface YtVideoWidgetProps {
  video: Video;
  onVideoEnd: () => void;
}

export interface YtVideoWidgetRef {
  pauseVideo: () => void;
  playVideo: () => void;
  scrollIntoView: () => void;
}

const YtVideoWidget = forwardRef<YtVideoWidgetRef, YtVideoWidgetProps>(
  function YtVideoWidget(
    { video, onVideoEnd }: YtVideoWidgetProps,
    forwaredVideoRef: React.ForwardedRef<YtVideoWidgetRef>
  ) {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const playPauseBtnRef = useRef<HTMLButtonElement>(null);

    const toggleMuted = useCallback(() => {
      if (videoRef.current) {
        if (isMuted) {
          videoRef.current.muted = false;
        } else {
          videoRef.current.muted = true;
        }
      }
      setIsMuted((muted) => !muted);
    }, [setIsMuted, videoRef, isMuted]);

    const handleVideoEnd = useCallback(() => {
      setIsPlaying(false);
      onVideoEnd();
    }, [setIsPlaying, onVideoEnd]);

    const scrollIntoView = useCallback(() => {
      if (videoRef.current) {
        videoRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "center",
        });
      }
    }, [videoRef]);

    const pauseVideo = useCallback(() => {
      if (isPlaying) {
        videoRef?.current?.pause();
        setIsPlaying(false);
      }
    }, [isPlaying]);

    const playVideo = useCallback(() => {
      if (!isPlaying) {
        videoRef?.current?.play().catch((e) => {
          console.log({
            playError: e,
          });

          // The timeout help to avoid blocking the eventual transition of the slider.
          const id = setTimeout(() => {
            alert(
              "Unable to play the video, please check if videos are allowed to play on this site."
            );
            clearTimeout(id);
          }, 1000);
        });
        setIsPlaying(true);
      }
    }, [isPlaying]);

    const togglePlay = useCallback(
      (animatePlayPauseBtn: boolean = false) => {
        if (animatePlayPauseBtn) {
          if (playPauseBtnRef.current?.classList.contains("grow-fade-in")) {
            playPauseBtnRef.current?.classList.remove("grow-fade-in");
          }

          playPauseBtnRef.current?.classList.add("grow-fade-in");
          const id = setTimeout(() => {
            playPauseBtnRef.current?.classList.remove("grow-fade-in");
            clearTimeout(id);
          }, 1200);
        }

        if (isPlaying) {
          pauseVideo();
        } else {
          playVideo();
        }
      },
      [pauseVideo, playVideo, isPlaying, playPauseBtnRef]
    );

    useEffect(() => {
      const videoElt = videoRef.current;
      videoElt?.addEventListener("ended", handleVideoEnd);

      return () => {
        videoElt?.removeEventListener("ended", handleVideoEnd);
      };
    }, [videoRef, handleVideoEnd]);

    useImperativeHandle(
      forwaredVideoRef,
      () => ({
        pauseVideo,
        playVideo,
        scrollIntoView,
      }),
      [pauseVideo, playVideo, scrollIntoView]
    );

    return (
      <div className="box-border flex justify-between items-stretch h-[765px]  w-[500px] max-w-[860px]  text-white">
        <div className="relative">
          <video
            className="rounded-2xl shadow-sm shadow-white/10 border border-white/10"
            ref={videoRef}
            src={video.src}
            poster={video.poster}
            width={430}
            height="100%"
            controls={false}
            muted={isMuted}
          />

          <div
            onClick={() => togglePlay(true)}
            className="absolute top-0 right-0 left-0 bottom-0 z-50 flex flex-col justify-between rounded-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 z-100">
              <button
                onClick={(e) => {
                  togglePlay();
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="text-2xl"
              >
                {isPlaying ? <MdPause /> : <MdPlayArrow />}
              </button>
              <button
                onClick={(e) => {
                  toggleMuted();
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="text-2xl"
              >
                {isMuted ? <MdVolumeOff /> : <MdVolumeUp />}
              </button>
            </div>

            <div className="flex flex-col gap-2 p-4">
              <h1>{video.title}</h1>
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <img
                    src={video.avatar}
                    alt={video.channel}
                    className="w-[40px] h-[40px] rounded-full drop-shadow-sm"
                  />
                  <h2>@{video.channel}</h2>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white hover:bg-gray-100 h-10 px-3 rounded-3xl
                text-black text-sm shadow-sm"
                >
                  Subscribe
                </button>
              </div>
            </div>

            <button
              ref={playPauseBtnRef}
              className="play-pause-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl bg-black/50 w-14 h-14 justify-center items-center rounded-full"
              disabled
            >
              {isPlaying ? <MdPlayArrow /> : <MdPause />}
            </button>

            <TimeProgress videoRef={videoRef} />
          </div>
        </div>
        <div className="flex-1 w-[70px] px-4">
          <YtActions />
        </div>
      </div>
    );
  }
);

export default YtVideoWidget;
