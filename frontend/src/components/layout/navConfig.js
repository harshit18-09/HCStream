import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import VideoLibraryRoundedIcon from "@mui/icons-material/VideoLibraryRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

export const navConfig = [
  {
    label: "Home",
    to: "/",
    icon: <HomeRoundedIcon fontSize="small" />,
  },
  {
    label: "Upload",
    to: "/videos/upload",
    icon: <CloudUploadRoundedIcon fontSize="small" />,
  },
  {
    label: "Playlists",
    to: "/playlists",
    icon: <VideoLibraryRoundedIcon fontSize="small" />,
  },
  {
    label: "Watch History",
    to: "/watch-history",
    icon: <HistoryRoundedIcon fontSize="small" />,
  },
  {
    label: "Liked Videos",
    to: "/likes",
    icon: <ThumbUpAltRoundedIcon fontSize="small" />,
  },
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: <BarChartRoundedIcon fontSize="small" />,
  },
  {
    label: "Tweets",
    to: "/tweets",
    icon: <ChatBubbleOutlineRoundedIcon fontSize="small" />,
  },
  {
    label: "Profile",
    to: "/profile",
    icon: <PersonRoundedIcon fontSize="small" />,
  },
];
