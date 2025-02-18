import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useCreateLectureMutation,
  useGetLecturesForAParticularCourseQuery,
} from "@/features/api/courseApi";
import Lecture from "./Lecture";

export default function CreateLecture() {
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;

  const [lectureTitle, setLectureTitle] = useState("");
  const [category, setCategory] = useState("");

  const [createLecture, { data, isLoading, isSuccess, isError, error }] =
    useCreateLectureMutation();
  const {
    data: lecturesData,
    isLoading: lecturesDataIsLoading,
    isSuccess: lecturesDataIsSuccess,
    isError: lecturesDataIsError,
    error: lecturesDataError,
  } = useGetLecturesForAParticularCourseQuery(courseId);

  const createLectureHandler = async () => {
    await createLecture({ lectureTitle, courseId });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
    }

    if (isError) {
      toast.error(error.data.message);
    }
  }, [isSuccess, isError, data]);

  console.log("LEC DATA", lecturesData);
  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Lets add lectures , add some basic details for your new Lectures
        </h1>
        <p className="text-sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cum, ea.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            name="courseTitle"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Your Lecture title name"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
          >
            Back to course
          </Button>
          <Button disabled={isLoading} onClick={createLectureHandler}>
            {" "}
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>

        <div className="mt-10">
          {lecturesDataIsLoading ? (
            <>
              <p>Loading Lectures.....</p>
            </>
          ) : lecturesDataError ? (
            <p>Failed to Load Lectures...</p>
          ) : lecturesData.lectures.length === 0 ? (
            <p>No Lectures Available for a particular course</p>
          ) : (

            lecturesData.lectures.map((lecture, index)=>{
              return <Lecture key = {lecture._id} lecture = {lecture} index = {index} courseId = {courseId}/>
            })
           
          )}
        </div>
      </div>
    </div>
  );
}
