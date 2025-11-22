import { Outlet, Route, Routes } from "react-router-dom";
import { LoginForm, AuthCheck, ChatList, Navbar } from './index'
import { ToastContainer } from "react-toastify";

function App() {
  function Layout() {
    return (
      <>
        <Navbar />
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
            <Route path="/" element={<ChatList />} />
          </Route>
        </Route>

      </Routes>

      <ToastContainer position="top-right" />
    </>
  );
}

export default App;
