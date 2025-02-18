import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AddCourse() {

  const navigate = useNavigate();
 
  const [courseTitle, setCourseTitle] = useState('')
  const [category,setCategory] = useState('')
  
  const [createCourse, {data, isLoading, isError, isSuccess}] = useCreateCourseMutation();

  const createCourseHandler = async () =>{
    console.log("Course Title is", courseTitle)
    console.log("Category is", category)

    await createCourse({courseTitle, category})

  }

  const getSelectedCategory = (value) =>{
    setCategory(value)
  }

  // for displaying the toast we use useEffect

  useEffect(() => {

    if(isSuccess){

        console.log("Data is", data?.message)
        toast.success(data?.message || "Course Created")
        setCourseTitle('')
        setCategory('')
        navigate('/admin/course')
    }

    if(isError){
        toast.success("Course creation failed")
    }
    
  }, [isSuccess, data])
  

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Lets add course, add some basic details for your new course
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
            value = {courseTitle}
            onChange = {(e) => setCourseTitle(e.target.value)}
            placeholder="Your course name"
          />
        </div>

        <div>
          <Label>Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="nextjs">Next JS</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
                <SelectItem value="frontend-development">
                  Frontend Development
                </SelectItem>
                <SelectItem value="fullstack-development">
                  Fullstack Development
                </SelectItem>
                <SelectItem value="mern-stack">
                  MERN Stack Development
                </SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="docker">Docker</SelectItem>
                <SelectItem value="mongodb">MongoDB</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/course")}>
            Back
          </Button>
          <Button disabled = {isLoading} onClick = {createCourseHandler}> {isLoading ? (<>
          <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
          Please wait
          </>) : "Create"}</Button>
        </div>
      </div>
    </div>
  );
}
