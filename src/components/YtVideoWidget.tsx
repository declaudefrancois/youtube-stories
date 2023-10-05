import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { MdPause, MdPlayArrow, MdVolumeOff, MdVolumeUp } from "react-icons/md";
import TimeProgress from "./TimeProgress";
import YtActions from "./YtActions";
import YtVideoCommentSection from "./YtVideoCommentSection";

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
  closeCommentSection: () => void;
}

const YtVideoWidget = forwardRef<YtVideoWidgetRef, YtVideoWidgetProps>(
  function YtVideoWidget(
    { video, onVideoEnd }: YtVideoWidgetProps,
    forwaredVideoRef: React.ForwardedRef<YtVideoWidgetRef>
  ) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playPauseBtnRef = useRef<HTMLButtonElement>(null);

    const [isMuted, setIsMuted] = useState<boolean>(false);
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

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const handleVideoEnd = useCallback(() => {
      setIsPlaying(false);
      onVideoEnd();
    }, [setIsPlaying, onVideoEnd]);

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

    const [isCommentExpanded, setIsCommentExpanded] = useState(false);
    const toggleCommentExpanded = useCallback(() => {
      setIsCommentExpanded((expanded) => !expanded);
    }, [setIsCommentExpanded]);

    const closeCommentSection = useCallback(() => {
      setIsCommentExpanded(false);
    }, [setIsCommentExpanded]);

    const scrollIntoView = useCallback(() => {
      if (videoRef.current) {
        videoRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "center",
        });
      }
    }, [videoRef]);

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
        closeCommentSection,
      }),
      [pauseVideo, playVideo, scrollIntoView, closeCommentSection]
    );

    const actions = useMemo(
      () => <YtActions onCommentPressed={toggleCommentExpanded} />,
      [toggleCommentExpanded]
    );

    const videoRadius = isCommentExpanded ? "rounded-s-2xl" : "rounded-2xl";

    return (
      <div
        className={`relative flex items-stretch h-[765px] min-w-[500px] max-w-[860px]  text-white`}
      >
        <div className="relative">
          <video
            className={`${videoRadius} shadow-sm shadow-white/10 border border-white/10`}
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
            className={`absolute top-0 right-0 left-0 bottom-0 z-50 ${videoRadius} overflow-hidden`}
          >
            <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-100">
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

            <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-4">
              <div className="flex justify-between items-end">
                <div>
                  <h1>{video.title}</h1>
                  <div className="flex gap-2 items-center">
                    <img
                      src={video.avatar}
                      alt={video.channel}
                      className="w-[40px] h-[40px] rounded-full drop-shadow-sm"
                    />
                    <h2>@{video.channel}</h2>
                  </div>
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

                {isCommentExpanded ? actions : null}
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

        {isCommentExpanded ? null : actions}

        <YtVideoCommentSection
          show={isCommentExpanded}
          onClose={closeCommentSection}
        />
      </div>
    );
  }
);

export default YtVideoWidget;
