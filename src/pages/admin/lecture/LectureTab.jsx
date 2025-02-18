import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import React, { useState } from "react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress"
import axios from "axios";
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from "@/features/api/courseApi";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const MEDIA_API = "http://localhost:8080/api/v1/media"

export default function LectureTab() {

    const [lectureTitle, setLectureTitle] = useState('');
    // After video is uploaded we will get a response, and we will store that response in a state
    const [uploadVideoInfo, setUploadVideoInfo] = useState(null)
    const [isFree, setIsFree] = useState(false)

    // To show the Progress Bar as the media gets uploaded we show this state
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); //value of upload
    const [btnDisable, setBtnDisable] = useState(true);
    const params = useParams()
    const {courseId, lectureId} = params;

    const [editLecture, {data, isLoading, error, isSuccess, isError}] = useEditLectureMutation()
    const [removeLecture, {data:removeData, isLoading:removeIsLoading, isSuccess:removeIsSuccess, isError:removeIsError, error:removeError}] = useRemoveLectureMutation()
    const {data:SingleLectureData} = useGetLectureByIdQuery(lectureId)


    


    const fileChangeHandler = async (e) =>{
        const file = e.target.files?.[0];

        if(file) {
            const formData = new FormData()
            console.log("IN this file change handler")
            formData.append("file", file)  //This thing and in BE we upload.single should match

            setMediaProgress(true);

            try {

                const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
                    withCredentials:true,
                    onUploadProgress:({loaded, total}) => setUploadProgress((loaded * 100)/total)
                    
                })

                if (res.data.success){
                    setUploadVideoInfo({videoUrl: res.data.data.url, publicId:res.data.data.public_id});
                    setBtnDisable(false)
                    toast.success(res.data.message)
                }
                
            } catch (error) {

                console.log(error);
                toast.error("Video upload failed")
                
            }finally{
                setMediaProgress(false);
            }
        }
    }

    

    const editLectureHandler = async () =>{

        // lectureTitle, videoInfo, isPreviewFree, courseId,lectureId

        console.log("LECTURE TITLE", lectureTitle)
        console.log("VIDEO INFO", uploadVideoInfo)
        console.log("IS PREVIEW FREE", isFree)
        console.log("COURSE ID", courseId)
        console.log("LECID", lectureId)

        await editLecture({lectureTitle, videoInfo:uploadVideoInfo,isPreviewFree:isFree,courseId, lectureId})

    }

    const removeLectureHandler = async ( ) =>{
        await removeLecture(lectureId);

    }

    useEffect (()=>{

        if(isSuccess){
            toast.success(data?.message);
        }

        if(isError){
            toast.error(error?.data?.message)
        }

    }, [isSuccess, data, isError])


    useEffect (()=>{

        if(removeIsSuccess){
            toast.success(removeData?.message);
        }

        if(removeError){
            toast.error(removeError?.data?.message)
        }

    }, [removeIsSuccess, removeData, removeIsError])


    useEffect(()=>{

        console.log("SINGLE LECTURE DATA", SingleLectureData?.lecture)

        if(SingleLectureData?.lecture){
            setLectureTitle(SingleLectureData?.lecture?.lectureTitle)
            setIsFree(SingleLectureData?.lecture?.isPreviewFree)
            setUploadVideoInfo(SingleLectureData?.videoInfo)
        }

    }, [SingleLectureData])



  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make changes and click save when done
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="destructive" onClick = {removeLectureHandler} disabled = {removeIsLoading}>
            {removeIsLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait..</>:"Remove Lecture"}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div>
          <Label>Title</Label>
          <Input type="text" placeholder="Ex. Introduction to Javascript" value = {lectureTitle} onChange = {(e) => setLectureTitle(e.target.value)}/>
        </div>
        <div className="my-5">
          <Label>
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            placeholder="Ex. Introduction to Javascript"
            accept="video/*"
            className="w-fit"
            onChange = {fileChangeHandler}
          />
        </div>

        <div className="flex items-center space-x-2 my-5">
          <Switch id="isFree" checked={isFree}
            onCheckedChange={(checked) => setIsFree(checked)}/>
          <Label htmlFor="airplane-mode">Is this video FREE</Label>
        </div>

        {mediaProgress && (<div className="my-4">
            <Progress value={uploadProgress} className="w-[60%]" />
            <p>{uploadProgress} % uploaded</p>
            </div>)}

        <div className="mt-4">
            <Button onClick = {editLectureHandler} disabled = {isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait..</>:"Update Lecture"}
            </Button>

        </div>
      </CardContent>
    </Card>
  );
}
