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
    icon: HomeRoundedIcon,
  },
  {
    label: "Upload",
    to: "/videos/upload",
    icon: CloudUploadRoundedIcon,
  },
  {
    label: "Playlists",
    to: "/playlists",
    icon: VideoLibraryRoundedIcon,
  },
  {
    label: "Watch History",
    to: "/watch-history",
    icon: HistoryRoundedIcon,
  },
  {
    label: "Liked Videos",
    to: "/likes",
    icon: ThumbUpAltRoundedIcon,
  },
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: BarChartRoundedIcon,
  },
  {
    label: "Tweets",
    to: "/tweets",
    icon: ChatBubbleOutlineRoundedIcon,
  },
  {
    label: "Profile",
    to: "/profile",
    icon: PersonRoundedIcon,
  },
];
