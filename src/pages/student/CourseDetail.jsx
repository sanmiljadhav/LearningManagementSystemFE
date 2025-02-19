import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React,{useEffect, useState} from "react";
import ReactPlayer from 'react-player/youtube'
import { Separator } from "@/components/ui/separator"
import BuyCourseButton from "@/components/react_comp/BuyCourseButton";
import { useParams } from "react-router-dom";
import axios from "axios";


export default function CourseDetail() {
    const [purchasedCourse, setPurchasedCourse] = useState(false)
    const {courseId} = useParams()
    const [course, setCourse] = useState(null);

    console.log("COURSE IS",course)

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
          alert("Failed to load Razorpay SDK. Please check your internet connection.");
          return;
        }

        const { data } = await axios.post("http://localhost:8080/api/v1/purchase/checkout/createOrder", {
          courseId,
          currency: "INR",
        },
        {withCredentials:true}
      );

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Please refresh the page.");
        return;
      }
  
        const options = {
          key: "rzp_test_sKz8VYa6lomMmV", // Replace with your actual Razorpay key
          amount: course.coursePrice * 100,
          currency: "INR",
          name: "SAMMIE Course Platform",
          description: course.courseTitle,
          order_id: data.orderId,
          handler: async function (response) {
            try {
              const verifyRes = await axios.post("http://localhost:8080/api/v1/purchase/verify-payment", {
                order_id: data.orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {withCredentials:true}
            );

            console.log("VERIFY RES",verifyRes)
  
              if (verifyRes.data.success) {
                setPurchasedCourse(true); // Update UI after successful payment
                alert("Payment Successful!");
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

    useEffect(() => {
      const fetchCourse = async () => {
        try {
          const { data } = await axios.get(`http://localhost:8080/api/v1/course/${courseId}`, {
            withCredentials: true, //  Ensures cookies (including token) are sent
          });

          // console.log("DAAAA", data.course)
          setCourse(data?.course);
        } catch (error) {
          console.error("Error fetching course:", error.response?.data || error.message);
        }
      };
    
      fetchCourse();
    }, [courseId]);
    

  return (
    <div className="mt-20 space-y-5">
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">Course Title</h1>
          <p className="text-base md:text-lg">Course Subtitle</p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              Patel Mernstack
            </span>
          </p>

          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated 11-11-2024</p>
          </div>
          <p>Students enrolled: 10</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p className="text-sm">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Inventore
            dolores nobis sint odio minima, culpa voluptatem, atque sunt
            voluptatum, magni reprehenderit corporis autem laudantium? Dolorum
            non culpa necessitatibus quisquam corrupti quasi dolores.
          </p>

          <Card>
            <CardHeader>
                <CardTitle>
                    Course Content
                </CardTitle>
                <CardDescription>4 lectures</CardDescription>
                <CardContent className = "space-y-3">
                    {
                        [1,2,3].map((lecture, idx)=>{

                            return <div key = {idx} className="flex flex-center gap-3 text-sm mt-4">
                                <span>
                                    {false ? (<PlayCircle size = {14}/>):(<Lock size ={14}/>)}
                                </span>
                                <p>Lecture title</p>

                            </div>

                        })
                    }

                </CardContent>

            </CardHeader>
          </Card>
        </div>

        <div className="w-full lg:w-1/2 space-y-5">
        <Card>
            <CardContent className= "p-4 flex flex-col">
                <div className="w-full aspect-video mb-4">
                <ReactPlayer url='https://www.youtube.com/watch?v=LXb3EKWsInQ' />

                </div>
                <h1>Lecture Title</h1>
                <Separator className="my-2"/>
                <h1 className="text-lg md:text-xl font-semibold">Course Price</h1>
                


            </CardContent>
            <CardFooter className = "flex justify-center p-4">
            {purchasedCourse ? (
                <Button className="w-full">Continue Course</Button>
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
