import { Outlet, Route, Routes } from "react-router-dom";
import { LoginForm, AuthCheck, Navbar, Chatbar, ChatPage, PageNotFound, SongWish } from './index'
import { ToastContainer } from "react-toastify";
import SelectUser from "./pages/SelectUser.jsx";
import { useEffect } from "react";
import { initiateSocketConnection } from "./socket/socket.js";
import { useUser } from "./context/UserContext.jsx";
import PopupWish from "./Birthday/PopupWish.jsx";
import BirthdayCarousel from "./Birthday/BirthdayCarousel.jsx";
import Canvas from "./components/Canvas/Canvas.jsx";
import { enableNotification } from "./services/notification.js";

function App() {
  const { user } = useUser()
  useEffect(() => {
    if (user?._id) {
      initiateSocketConnection(user._id);
    }
    if (user?.username === "manthan") {
      enableNotification();
    }
  }, [user]);


  function Layout() {
    return (
      <>
        <Navbar />
        <Chatbar />
        <Outlet />
      </>
    )
  }
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/canvas" element={<Canvas />} />

        <Route element={<AuthCheck />}>
          <Route element={<Layout />}>
            <Route path="/" element={<SelectUser />} />
            <Route path="/chat/:friendId" element={<ChatPage />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Route>

        <Route path="/birthday/popup-wish" element={<PopupWish />} />
        <Route path="/birthday/card-wish" element={<BirthdayCarousel />} />
        <Route path="/birthday/song-wish" element={<SongWish />} />
      </Routes>
      <ToastContainer position="top-center" theme="colored" autoClose={3000} />
    </>
  );
}

export default App;
