import { Outlet, Route, Routes } from "react-router-dom";
import { LoginForm, AuthCheck, Navbar, Chatbar, ChatPage, PageNotFound } from './index'
import { ToastContainer } from "react-toastify";

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
            <Route path="/" element={<ChatPage />} />
            <Route path="/chat/:id" element={<ChatPage />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" />
    </>
  );
}

export default App;
