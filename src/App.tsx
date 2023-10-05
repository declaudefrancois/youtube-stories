import "./App.css";
import VideosSlider from "./components/VideosSlider";
import { Video } from "./components/YtVideoWidget";

import video1 from "./assets/videos/story-1.mp4";
import video2 from "./assets/videos/story-2.mp4";
import video3 from "./assets/videos/story-3.mp4";
import video4 from "./assets/videos/story-4.mp4";
import poster1 from "./assets/videos/poster-1.jpg";
import avatar from "./assets/videos/avatar.jpg";

const videos: Video[] = [
  {
    src: video1,
    title: "Story 1",
    poster: poster1,
    channel: "Channel 1",
    avatar: avatar,
  },
  {
    src: video2,
    title: "Story 2",
    poster: poster1,
    channel: "Channel 2",
    avatar: avatar,
  },
  {
    src: video2,
    title: "Story 1",
    poster: poster1,
    channel: "Channel 1",
    avatar: avatar,
  },
  {
    src: video3,
    title: "Story 1",
    poster: poster1,
    channel: "Channel 1",
    avatar: avatar,
  },
  {
    src: video4,
    title: "Story 1",
    poster: poster1,
    channel: "Channel 1",
    avatar: avatar,
  },
  // TODO: handle the overflow with this video.
  // {
  //   src: video5,
  //   title: "Story 1",
  //   poster: poster1,
  //   channel: "Channel 1",
  //   avatar: avatar,
  // },
];

function App() {
  return <VideosSlider videos={videos} />;
}

export default App;
