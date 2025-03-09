import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DriverContext from './context/DriverContext.jsx'
import UserContext from './context/userContext.jsx'
import SocketContext from "./context/SocketContext.jsx"
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContext>
    <DriverContext>
    <SocketContext>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SocketContext>
  </DriverContext>
    </UserContext>
 
</StrictMode>,
)
