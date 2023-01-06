import './App.css';

import Header from "./components/Layout/Header";
import RegisterUser from "./components/User/RegisterUser";
import {BrowserRouter, Navigate, Route, Routes, useLocation} from "react-router-dom";
import LoginUser from "./components/User/LoginUser";
import Sidebar from "./components/Layout/Sidebar";
import {UserPage} from "./components/User/UserPage";
import {Footer} from "./components/Layout/Footer";
import {ChatRooms} from "./components/Chat/ChatRooms";
import HomeFeed from "./components/Feed/HomeFeed";
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import WhiteBoard from "./components/Whiteboard/WhiteBoard";
import UserService from "./services/UserService";
import Diagram from "./components/Diagram/Diagram";

function App() {
    const userService = UserService();

    const queryClient = new QueryClient();

    const ProtectedRoute = ({ children }) => {
        const isLoggedIn = userService.isLoggedIn();

        if(!isLoggedIn) {
            return <Navigate to={"/login"} replace/>;
        }
        return children;
    };


    return (
        <QueryClientProvider client={queryClient}>
          <div className="layout">
              <BrowserRouter>
                  <Header/>
                  <div className={"content"}>
                      <Sidebar/>
                      <Routes>
                          <Route path="/register" element={
                               <RegisterUser/>
                          }/>

                          <Route path="/login" element={
                              <LoginUser/>
                          }/>

                          <Route path="/" element={
                              <ProtectedRoute>
                                <HomeFeed/>
                              </ProtectedRoute>}/>

                          <Route path="/chatRooms" element={
                              <ProtectedRoute>
                                  <ChatRooms/>
                              </ProtectedRoute>}/>

                          <Route path="/user/:userId" element={
                              <ProtectedRoute>
                                  <UserPage/>
                              </ProtectedRoute>}/>

                          <Route path="/whiteboard/:id" element={
                              <ProtectedRoute>
                                  <WhiteBoard/>
                              </ProtectedRoute>}/>

                          <Route path="/diagram" element={
                              <ProtectedRoute>
                                  <Diagram/>
                              </ProtectedRoute>}/>
                      </Routes>
                  </div>
              </BrowserRouter>
              <Footer/>
          </div>
        </QueryClientProvider>
  );
}

export default App;
