import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VideoFeedPage from "./pages/videos/VideoFeedPage";
import UploadVideoPage from "./pages/videos/UploadVideoPage";
import VideoDetailPage from "./pages/videos/VideoDetailPage";
import PlaylistsPage from "./pages/playlists/PlaylistsPage";
import PlaylistDetailPage from "./pages/playlists/PlaylistDetailPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import LikedVideosPage from "./pages/likes/LikedVideosPage";
import WatchHistoryPage from "./pages/history/WatchHistoryPage";
import TweetsPage from "./pages/tweets/TweetsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import SettingsPage from "./pages/profile/SettingsPage";

const App = () => (
  <Routes>
    <Route path="/auth">
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route index element={<VideoFeedPage />} />
        <Route path="videos">
          <Route index element={<VideoFeedPage />} />
          <Route path="upload" element={<UploadVideoPage />} />
          <Route path=":videoId" element={<VideoDetailPage />} />
        </Route>
        <Route path="playlists" element={<PlaylistsPage />} />
        <Route path="playlists/:playlistId" element={<PlaylistDetailPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="likes" element={<LikedVideosPage />} />
        <Route path="watch-history" element={<WatchHistoryPage />} />
        <Route path="tweets" element={<TweetsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
