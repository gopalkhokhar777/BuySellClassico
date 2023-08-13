import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ConfigProvider } from 'antd';
import store from './redux/store';
import { Provider } from 'react-redux';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    {/* to declare properties globally use theme */}
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: '#557A46',
            colorPrimaryHover: '#557A46',
            borderRadius: '0px'
          }
        },
        token: {
          borderRadius: "2px",
          colorPrimary: "#557A46"
        }
      }
      }
    >
      <App />
    </ConfigProvider>
  </Provider>
);