import { MdComment, MdMoreHoriz, MdThumbDown, MdThumbUp } from "react-icons/md";
import { IoMdShareAlt } from "react-icons/io";

export default function YtActions() {
  return (
    <div className="flex flex-col justify-end items-center gap-2 h-full">
      <div className="flex flex-col gap-1">
        <button className="text-xl bg-white/20 hover:bg-white/30 flex items-center justify-center w-12 h-12 rounded-full">
          <MdThumbUp />
        </button>
        <span className="text-sm text-center">349K</span>
      </div>

      <div className="flex flex-col gap-1">
        <button className="text-xl bg-white/20 hover:bg-white/30 flex items-center justify-center w-12 h-12 rounded-full">
          <MdThumbDown />
        </button>
        <span className="text-sm text-center">Dislike</span>
      </div>

      <div className="flex flex-col gap-1">
        <button className="text-xl bg-white/20 hover:bg-white/30 flex items-center justify-center w-12 h-12 rounded-full">
          <MdComment />
        </button>
        <span className="text-sm text-center">3.1K</span>
      </div>

      <div className="flex flex-col gap-1">
        <button className="text-xl bg-white/20 hover:bg-white/30 flex items-center justify-center w-12 h-12 rounded-full">
          <IoMdShareAlt />
        </button>
        <span className="text-sm text-center">Share</span>
      </div>

      <div className="flex flex-col gap-1">
        <button className="text-xl bg-white/20 hover:bg-white/30 flex items-center justify-center w-12 h-12 rounded-full">
          <MdMoreHoriz />
        </button>
      </div>
    </div>
  );
}
