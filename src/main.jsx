import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css';
import { Auth0Provider } from "@auth0/auth0-react";
ReactDOM.createRoot(document.getElementById('root')).render(
 <Auth0Provider
    domain="dev-b8awg5j6uhzut6aa.us.auth0.com"
    clientId="ZevMRyt149RUyWV1CSDPF3uJTzrPfRcz"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>,
)
