import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"

export default function Login() {
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [registerUser, {data: registerData, error: registerError, isLoading: registerIsLoading, isSuccess: registerIsSuccess}] = useRegisterUserMutation()
  const [loginUser, {data: loginData, error: loginError, isLoading: loginIsLoading, isSuccess:loginIsSuccess}] = useLoginUserMutation()
  const navigate = useNavigate()

  const onInputChangeHandler = (e, type) =>{
    // Same function handles both state change
    const {name, value} = e.target;
    if(type === "signup"){
        setSignupInput({...signupInput, [name]:value})
    }else{
        setLoginInput({...loginInput, [name]:value})
    }

  }



  const handleRegistrationAndLogin = async(type) =>{

    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser: loginUser;
    await action(inputData)

    console.log("Input data after Submit", inputData)
    
  }

  useEffect (()=>{

    if(registerIsSuccess && registerData){

        toast.success(registerData.message || "Signup successfull")
        
    }

    if(registerError){
        toast.error(registerError.data.message || "Signup failed")

    }

    if(loginError){
        toast.error(loginError.data.message || "Login failed")

    }

    if(loginIsSuccess && loginData){

        toast.success(loginData.message || "Login successfull")
        navigate("/")
        
    }

  },[loginIsLoading,registerIsLoading,loginData, registerData, loginError, registerError])

 
  return (
    <div className="flex w-full items-center justify-center mt-20">
      <Tabs defaultValue="signup" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Create a new account and click on Signup cta when you are done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" placeholder="eg. Sanmil" name="name" value={signupInput.name} onChange={(e)=>onInputChangeHandler(e,"signup")} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="eg. abc@gmail.com"
                  required="true"
                  name="email" 
                  value={signupInput.email} 
                  onChange={(e)=>onInputChangeHandler(e,"signup")}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required="true"
                  name="password" 
                  value={signupInput.password} 
                  onChange={(e)=>onInputChangeHandler(e,"signup")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled = {registerIsLoading} onClick = {()=>handleRegistrationAndLogin("signup")} >
              {
                registerIsLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait...</>):"Signup"
              }
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Login with your password here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="eg. abc@gmail.com"
                  required="true"
                  name="email"
                  value={loginInput.email}
                  onChange={(e)=>onInputChangeHandler(e,"login")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password2"
                  type="password"
                  placeholder="enter your password here"
                  required="true"
                  name="password"
                  value={loginInput.password}
                  onChange={(e)=>onInputChangeHandler(e,"login")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled = {loginIsLoading}  onClick = {()=>handleRegistrationAndLogin("login")}>
              {
                loginIsLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait...</>):"Login"
              }


              </Button>
              
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
