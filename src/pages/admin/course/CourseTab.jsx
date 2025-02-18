import RichTextEditor from "@/components/react_comp/RichTextEditor";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from "@/features/api/courseApi";
import { toast } from "sonner";

export default function CourseTab() {
  const isPublished = true;
  
  const navigate = useNavigate()
  const params = useParams()
  const courseId = params.courseId;
  

  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const [previewThumbnail, setPreviewThumbnail] = useState('');

  const [editCourse, {data, isLoading, isSuccess, isError, error}] = useEditCourseMutation();
  const {data:courseByIdData, isLoading:courseByIdIsLoading, isSuccess:courseByIdSuccess,refetch} = useGetCourseByIdQuery(courseId, {refetchOnMountOrArgChange:true});
  const [publishCourse, {}] = usePublishCourseMutation()

  const changeInputHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) =>{
    setInput({...input, category:value})

  }

  const selectCourseLevel = (value) =>{
    setInput({...input, courseLevel:value})

  }


  // get File

  const selectThumbnail = (e) =>{
    const file = e.target.files?.[0];
    if(file){
        setInput({...input, courseThumbnail:file});

        // show preview when user uploads the file
        // When u upload the file u have to convert it to Url
        const fileReader = new FileReader();
        fileReader.onloadend = () =>setPreviewThumbnail(fileReader.result);
        fileReader.readAsDataURL(file);
    }
  }

  const updateCourseHandler = async() =>{

    const formData = new FormData()
    formData.append('courseTitle', input.courseTitle)
    formData.append('subTitle', input.subTitle)
    formData.append('description', input.description)
    formData.append('category', input.category)
    formData.append('courseLevel', input.courseLevel)
    formData.append('coursePrice', input.coursePrice)
    formData.append('courseThumbnail', input.courseThumbnail)
    await editCourse({formData, courseId}); 

  }

  const publishCourseStatusHandler = async (action) =>{
    try {

        const response = await publishCourse({courseId, query:action})
        if(response?.data){
            refetch();
            toast.success(response.data.message)
        }
        
    } catch (error) {

        console.log("ERRORP",error)

        toast.error("Failed to publish or unpublish course")
        
    }

  }

  useEffect(() => {

    if(isSuccess){
        toast.success(data?.message || "Course Updated success")
    }

    if(isError){
        console.log("IS Error is", isError)
        
        toast.error(error?.data?.message || "Failed to update course")
    }
   
  }, [isSuccess, isError, data])


  useEffect(()=>{

    

    if(courseByIdData?.course){
        setInput({
            courseTitle: courseByIdData?.course.courseTitle,
            subTitle: courseByIdData?.course.subTitle,
            description: courseByIdData?.course.description,
            category: courseByIdData?.course.category,
            courseLevel: courseByIdData?.course.courseLevel,
            coursePrice: courseByIdData?.course.coursePrice,
            courseThumbnail: "",
          })
    }

  }, [courseByIdData])

  if (courseByIdIsLoading) return <Loader2 className="h-4 w-4 animate-spin"/>
  

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make Changes to your courses here and click save when you're done
          </CardDescription>
        </div>

        <div className="space-x-2">
          <Button variant="outline space-x-2" disabled = {courseByIdData?.course?.lectures.length == 0} onClick ={()=>publishCourseStatusHandler(courseByIdData?.course?.isPublished ? "false": "true")} >
            {courseByIdData?.course?.isPublished ? "Unpublished" : "Publish"}
          </Button>

          <Button>Remove course</Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Course Title</Label>
            <Input
              type="text"
              placeholder="Ex. FullStack Developer"
              name="courseTitle"
              value={input.courseTitle}
              onChange = {changeInputHandler}
            />
          </div>

          <div>
            <Label>CourseSub Title</Label>
            <Input
              type="text"
              placeholder="Ex. Become a Full Stack Developer from Zero to Hero in two moths"
              name="subTitle"
              value={input.subTitle}
              onChange = {changeInputHandler}
            />

            
          </div>

          <div>
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>

          <div className="flex items-center gap-5">
            <div>
              <Label>Category</Label>
              <Select onValueChange={selectCategory} defaultValue={input.category}>
                <SelectTrigger className="w-[180px]" >
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

            <div>
              <Label>Course Level</Label>
              <Select onValueChange={selectCourseLevel} defaultValue={input.courseLevel}>
                <SelectTrigger className="w-[180px]" >
                  <SelectValue placeholder="Select the course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advanced">
                      Advanced
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
                <Label>Price in (INR)</Label>
                <Input type = "number" name="coursePrice" value = {input.coursePrice} onChange = {changeInputHandler} placeholder = "199" className = "w-fit"/>
            </div>

            
          </div>
          <div>
                <Label>Coure Thumbnail</Label>
                <Input type = "file" accept = "image/*" className="w-fit" onChange = {selectThumbnail} />
                {
                previewThumbnail && <img src = {previewThumbnail} className="w-64 my-2" alt = "Course Thumbnail" />
            }
            </div>

            <div className="space-x-2">
                <Button variant = 'outline' onClick = {()=>navigate("/admin/course")}>Cancel</Button>
                <Button disabled = {isLoading} onClick = {updateCourseHandler}>
                    {
                        isLoading ? (
                            <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            
                            </>

                        ):"Save"
                        
                    }
                </Button>
            </div>
        </div>


      </CardContent>
    </Card>
  );
}
