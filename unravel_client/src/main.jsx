import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './app/store'
import App from './App'
import './index.css'
import './styles.scss'
import { ClickToComponent } from 'click-to-react-component'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ClickToComponent />
    </Provider>
  </React.StrictMode>
)
