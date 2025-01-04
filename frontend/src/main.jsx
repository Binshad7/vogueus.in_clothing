import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store/store.js'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import SideBarContext from './context/SideBarContext.jsx'
createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <StrictMode>
      <Provider store={store}>
        <SideBarContext>
          <App />
        </SideBarContext>
      </Provider>
    </StrictMode>
  </GoogleOAuthProvider>
)
