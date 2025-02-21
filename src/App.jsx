import { useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import Login from "./pages/Login";
import Navbar from "./components/react_comp/Navbar";
import HeroSection from "./components/student/HeroSection";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Courses from "./components/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/course/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import Editlecture from "./pages/admin/lecture/Editlecture";
import CourseDetail from "./pages/student/CourseDetail";
import CourseProgress from "./pages/student/CourseProgress";
import SearchPage from "./pages/student/SearchPage";
import { AdminRoute, AuthenticatedUser, ProtectedRoute } from "./components/ProtectedRoute";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  const [count, setCount] = useState(0);

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: (
            <>
              <HeroSection />
              <Courses/>
            </>
          ),
        },

        {
          path: "login",
          element: (
            <>
            <AuthenticatedUser><Login /></AuthenticatedUser>
              
            </>
          ),
        },

        {
          path: "my-learning",
          element: (
            <>
            <ProtectedRoute><MyLearning /></ProtectedRoute>
              
            </>
          ),
        },

        {
          path: "profile",
          element: (
            <>
            <ProtectedRoute><Profile/></ProtectedRoute>
              
            </>
          ),
        },

        {
          path:"course-detail/:courseId",
          element:<ProtectedRoute><CourseDetail/></ProtectedRoute>
        },

        {
          path:"course-progress/:courseId",
          element:<ProtectedRoute><CourseProgress/></ProtectedRoute>
        },
        {
          path:"course/search",
          element:<ProtectedRoute><SearchPage/></ProtectedRoute>
        },

        // Admin Routes starts here

        {
          path:"admin",
          element:<AdminRoute><Sidebar/></AdminRoute>,
          children:[{
            path:"dashboard",
            element:<Dashboard/>
          },
          {
            path:"course",
            element:<CourseTable/>

          },
          {
            path:"course/create",
            element:<AddCourse/>

          },
          {
            path:"course/:courseId",
            element:<EditCourse/>

          },
          {
            path:"course/:courseId/lecture",
            element:<CreateLecture/>

          },
          {
            path:"course/:courseId/lecture/:lectureId",
            element:<Editlecture/>

          }
        ]
        }


      ],
    },
  ]);

  return (
    <main>
      <ThemeProvider><RouterProvider router = {appRouter}/></ThemeProvider>
      
     
    </main>
  );
}

export default App;
