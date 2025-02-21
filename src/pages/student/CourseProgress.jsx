
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CheckCircle2, CirclePlay } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGetCourseDetailsWithPurchaseStatusQuery } from "@/features/api/purchaseApi";
import { useNavigate, useParams } from "react-router-dom";

export default function CourseProgress() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isSuccess, error, isError } = useGetCourseDetailsWithPurchaseStatusQuery(courseId);

  // Moved useState hooks outside conditions
  const [lecture, setLecture] = useState(null);
  const [isCompleted, setIsCompleted] = useState(true);
  const [selectedLectureIndex, setSelectedLectureIndex] = useState(null);

  console.log("selected index", selectedLectureIndex)

  const course = data?.course;

  useEffect(() => {
    // Set the first lecture as default when course data loads
    if (course?.lectures?.length) {
      setLecture(course.lectures[0]);
      
    }
  }, [course]);

  const handleLectureClick = (lec,index) =>{
    console.log("Card clicked", index)
    setLecture(lec);
    setSelectedLectureIndex(index);

  }

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Failed to Load course details</h1>;

  

  

  return (
    <div className="max-w-7xl mx-auto p-4 mt-20">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{course?.courseTitle}</h1>
        <Button onClick={() => setIsCompleted(!isCompleted)}>Toggle Completed</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <div>
            {lecture ? (
              <video src={lecture?.videoUrl} controls className="w-full h-auto md:rounded-lg" />
            ) : (
              <p>Select a lecture to play the video</p>
            )}
          </div>
          <div className="mt-2">
            <h3 className="font-medium text-lg">{lecture?.lectureTitle}</h3>
          </div>
        </div>
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
          <div className="flex-1 overflow-y-auto">
            {course?.lectures.map((lec, idx) => {
              return (
                <Card key={idx} className={`mb-3 hover:cursor-pointer transition transform ${selectedLectureIndex === idx ? 'bg-violet-800 text-white' : ''}`} onClick={() => handleLectureClick(lec, idx)}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      {isCompleted ? (
                        <CheckCircle2 size={24} className="text-green-500 mr-2" />
                      ) : (
                        <CirclePlay size={24} className="text-gray-500 mr-2" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {"Lecture " + (idx + 1) + " : " + lec.lectureTitle}
                      </CardTitle>
                    </div>
                    <Badge variant="outline" className="bg-green-200 text-green-600">
                      Completed
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
