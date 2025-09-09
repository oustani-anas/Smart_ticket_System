
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Dashboard, HomeLayout, Landing, Login, Register, PaymentSuccess } from "./pages";
import { ToastContainer } from 'react-toastify';
import Events from "./pages/Events";
import Profile from "./pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "paymentSuccess",
        element: <PaymentSuccess />,
      }
    ],
  },
]);

function App() {
  return (
    <>
        <RouterProvider router = {router} />
        <ToastContainer position = 'top-center' />
    </>
  )
}

export default App
