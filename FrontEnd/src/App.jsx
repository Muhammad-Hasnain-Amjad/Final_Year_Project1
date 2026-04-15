import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChatProvider } from "./Context/ChatContext";

import Home from './Pages/Home';
import Dr from './Pages/Dr';
import LawyerProfile from './Pages/LawyerProfile';
import Lawyers from './Pages/Lawyers';
import About from './Pages/About';
import Contactus from './Pages/Contactus';
import Login from './Pages/Login';
import MyProfile from './Pages/MyProfile';
import MyAppointments from './Pages/MyAppointments';
import Dr_Reg from './Pages/Dr_Reg';
import NotFound from './Pages/NotFound';
import Law_Reg from './Pages/Law_Reg';
import Signup from './Pages/Signup';
import View_Lawyer_Profile from './Lawyers_files/View_Lawyer_Profile';
import LawyerAppointments from './Lawyers_files/LawyerAppointments';
import ChatPage from "./Pages/Chat/ChatPage";

// ✅ Create router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/doctors",
    element: <Dr />
  },
  {
    path: "/lawyers",
    element: <Lawyers />
  },
  {
    path: "/about",
    element: <About />
  },
  {
    path: "/contactus",
    element: <Contactus />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/myprofile",
    element: <MyProfile />
  },
  {
    path: "/myappointments",
    element: <MyAppointments />
  },
  {
    path: "/drform",
    element: <Dr_Reg />
  },
  {
    path: "/lawyerform",
    element: <Law_Reg />
  },
  {
    path: "/lawyer/:id",
    element: <View_Lawyer_Profile />
  },
  {
    path: "/lawyers_a/:id",
    element: <LawyerProfile />
  },
  {
    path: "/appointments",
    element: <LawyerAppointments />
  },
  {
    path: "/chats",
    element: <ChatPage />
  },
  {
    path: "/chats/:chatId",
    element: <ChatPage />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

function App() {
  return (
    <ChatProvider>
      <RouterProvider router={router} />
    </ChatProvider>
  );
}

export default App;