import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Separator } from "@/components/ui/separator";
import BuyCourseButton from "@/components/react_comp/BuyCourseButton";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useGetCourseDetailsWithPurchaseStatusQuery } from "@/features/api/purchaseApi";

export default function CourseDetail() {
  const [purchasedCourse, setPurchasedCourse] = useState(false);
  const { courseId } = useParams();
  const navigate = useNavigate()
  // const [course, setCourse] = useState(null);

  const { data, isLoading, isSuccess, error, isError } =
    useGetCourseDetailsWithPurchaseStatusQuery(courseId);

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Failed to Load course details</h1>;

  const course = data?.course;
  const purchased = data?.purchased;

  console.log("COURSE SSSS ISS", course);
  console.log("PURCHSAED", purchased);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        alert(
          "Failed to load Razorpay SDK. Please check your internet connection."
        );
        return;
      }

      const { data } = await axios.post(
        "http://localhost:8080/api/v1/purchase/checkout/createOrder",
        {
          courseId,
          currency: "INR",
        },
        { withCredentials: true }
      );

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Please refresh the page.");
        return;
      }

      const options = {
        key: "rzp_test_sKz8VYa6lomMmV", // Replace with your actual Razorpay key
        amount: course?.coursePrice * 100,
        currency: "INR",
        name: "SAMMIE Course Platform",
        description: course?.courseTitle,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:8080/api/v1/purchase/verify-payment",
              {
                order_id: data.orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            console.log("VERIFY RES", verifyRes);

            if (verifyRes.data.success) {
              setPurchasedCourse(true); // Update UI after successful payment
              alert("Payment Successful!");
              window.location.reload()
            } else {
              alert("Payment verification failed!");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            alert("Payment failed!");
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment initialization failed!");
    }
  };

  const handleContinueCourse = () =>{
    if(purchased){
      navigate(`/course-progress/${courseId}`)

    }
  }

  return (
    <div className="space-y-5">
      <div className="bg-[#2D2F31] text-white pt-10 mt-4">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">
            {course?.courseTitle}
          </h1>
          <p className="text-base md:text-lg">
            {course?.subTitle || "subtitle"}
          </p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              {course?.creator?.name}
            </span>
          </p>

          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated {course?.createdAt.split("T")[0]}</p>
          </div>
          <p>Students enrolled: {course?.enrolledStudents.length}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: course?.description }}
          />

          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                {course?.lectures?.length} lectures
              </CardDescription>
              <CardContent className="space-y-3">
                {course?.lectures?.map((lecture, idx) => {
                  return (
                    <div
                      key={idx}
                      className="flex flex-center gap-3 text-sm mt-4"
                    >
                      <span>
                        {purchased ? <PlayCircle size={14} /> : <Lock size={14} />}
                      </span>
                      <p>{lecture.lectureTitle}</p>
                    </div>
                  );
                })}
              </CardContent>
            </CardHeader>
          </Card>
        </div>

        <div className="w-full lg:w-1/2 space-y-5">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4">
                {course?.lectures?.[0]?.videoUrl ? (
                  <ReactPlayer
                    url={course.lectures[0].videoUrl}
                    controls={true}
                    width="100%"
                    height="100%"
                  />
                ) : (
                  <p>Loading video...</p>
                )}
              </div>
              <h1>Lecture Title</h1>
              <Separator className="my-2" />
              <h1 className="text-lg md:text-xl font-semibold">
                {course?.lectures?.[0]?.lectureTitle}
              </h1>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {purchased ? (
                <Button className="w-full" onClick = {handleContinueCourse}>Continue Course</Button>
              ) : (
                <Button className="w-full" onClick={handlePayment}>
                  Buy Now
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
