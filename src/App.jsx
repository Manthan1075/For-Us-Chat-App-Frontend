import { Route, Routes } from 'react-router-dom'
import { LoginForm } from './index'
import { ToastContainer } from 'react-toastify'

function App() {
  console.log("Hello World!!");

  return (
    <>
      <Routes>
        <Route path='/login' element={<LoginForm />} />
      </Routes>
      <ToastContainer position='bottom-left' />
    </>
  )
}

export default App
