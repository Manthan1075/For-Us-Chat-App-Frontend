import { Outlet, Route, Routes } from "react-router-dom";
import { LoginForm, AuthCheck, Navbar, Chatbar, ChatPage, PageNotFound } from './index'
import { ToastContainer } from "react-toastify";
import SelectUser from "./pages/SelectUser.jsx";

function App() {
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
      <ToastContainer position="top-right" stacked={true} />
    </>
  );
}

export default App;
