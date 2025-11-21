import { createRoot } from 'react-dom/client'
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { UserProvider } from './context/UserContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </ThemeProvider>
)
