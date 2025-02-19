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
              <Login />
            </>
          ),
        },

        {
          path: "my-learning",
          element: (
            <>
              <MyLearning />
            </>
          ),
        },

        {
          path: "profile",
          element: (
            <>
              <Profile/>
            </>
          ),
        },

        {
          path:"course-detail/:courseId",
          element:<CourseDetail/>
        },

        // Admin Routes starts here

        {
          path:"admin",
          element:<Sidebar/>,
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
      <RouterProvider router = {appRouter}/>
     
    </main>
  );
}

export default App;
