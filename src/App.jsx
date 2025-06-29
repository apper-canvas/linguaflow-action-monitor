import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/Layout';
import { routeArray } from '@/config/routes';
import { initializeNotifications } from '@/services/api/notificationService';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // Initialize notifications on app start
  React.useEffect(() => {
    initializeNotifications();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {routeArray.map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
        toastClassName="bg-white shadow-lg rounded-lg"
        progressClassName="bg-gradient-to-r from-primary to-secondary"
      />
    </BrowserRouter>
  );
}

export default App;