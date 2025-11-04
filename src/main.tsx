import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ReactNotifications } from 'react-notifications-component';
import { ConfigProvider } from 'antd';
import TopLayout from './components/TopLayout';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter future={{ v7_startTransition: true }}>
    <ReactNotifications />
    <ConfigProvider theme={{}}>
      <TopLayout />
    </ConfigProvider>
  </BrowserRouter>
);
