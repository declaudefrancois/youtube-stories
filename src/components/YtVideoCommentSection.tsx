import { useRef } from "react";
import { MdClose } from "react-icons/md";

interface YtVideoCommentSectionProps {
  onClose: () => void;
  show: boolean;
}

export default function YtVideoCommentSection({
  onClose,
  show,
}: YtVideoCommentSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  if (show) {
    ref?.current?.classList.add("visible");
  } else {
    ref?.current?.classList.remove("visible");
  }

  return (
    <div
      ref={ref}
      className="comment-section transition-all duration-300 ease-in-out bg-[#212121] rounded-e-lg"
    >
      {show && (
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Comments</h1>

          <button
            className="text-4xl"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <MdClose />
          </button>
        </div>
      )}
    </div>
  );
}
