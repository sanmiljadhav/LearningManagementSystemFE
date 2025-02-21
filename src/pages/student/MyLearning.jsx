import Course from "@/components/student/Course";
import { useLoadUserQuery } from "@/features/api/authApi";
import React from "react";

// Jo courses User ne purchase kiye hai wo "My Learning" me aayenge

export default function MyLearning() {

  
  const isLoading = false;
  const { data, isLoading: isProfileDataLoading, refetch } = useLoadUserQuery();
  const myLearningCourses = data?.user.enrolledCourses || []

  
  

  return (
    <div className="max-w-4xl mx-auto my-24 px-4 md:px-0">
      <h1 className="font-bold text-2xl">MY LEARNING</h1>

      <div className="my-5">
        {isLoading ? (
          <MyLearningSkeleton />
        ) : myLearningCourses.length === 0 ? (
          <p>You are not enrolled in any course</p>
        ) : (
          <div className="grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {myLearningCourses.map((course, index) => {
              return <Course key={index} course={course} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const MyLearningSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, index) => {
        return (
          <div
            key={index}
            className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
          ></div>
        );
      })}
    </div>
  );
};
