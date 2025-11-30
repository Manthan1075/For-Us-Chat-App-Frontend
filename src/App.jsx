import { Outlet, Route, Routes } from "react-router-dom";
import { LoginForm, AuthCheck, Navbar, Chatbar, ChatPage, PageNotFound } from './index'
import { ToastContainer } from "react-toastify";
import SelectUser from "./pages/SelectUser.jsx";
import { useEffect } from "react";
import { initiateSocketConnection } from "./socket/socket.js";
import { useUser } from "./context/UserContext.jsx";


function App() {
  const { user } = useUser()
  useEffect(() => {
    if (user?._id) {
      const socket = initiateSocketConnection(user._id);
      console.log("Socket Initiate :", socket.id);

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
        <Route element={<AuthCheck />}>
          <Route element={<Layout />}>
            <Route path="/" element={<SelectUser />} />
            <Route path="/chat/:friendId" element={<ChatPage />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" stacked={true} autoClose={3000} />
    </>
  );
}

export default App;
