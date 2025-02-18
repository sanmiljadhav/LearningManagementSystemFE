import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog } from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Course from "@/components/student/Course";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";

export default function Profile() {
  const { data, isLoading: isProfileDataLoading, refetch } = useLoadUserQuery();
  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isSuccess: updateUserIsSuccess,
      error: updateUserError,
    },
  ] = useUpdateUserMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  // Set initial state once data is loaded
  useEffect(() => {
    if (data?.user) {
      setName(data.user.name);
      setEmail(data.user.email);
    }
  }, [data]);

  useEffect(() => {
    if (updateUserIsSuccess) {
      refetch();
      toast.success(updateUserData.message || "Profile Update Successfully");
    }

    if (updateUserError) {
      toast.success(
        updateUserError.message || "There is some error in updating profile"
      );
    }
  }, [updateUserError, updateUserIsSuccess, updateUserData]);

  useEffect(() => {
    refetch();
  }, []);

  // Profile photo change handler
  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  // Update user handler
  const updateUserHandler = async () => {
    console.log("Data is", name, email, profilePhoto);

    // we will make form Data here
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("profilePhoto", profilePhoto);
    await updateUser(formData);
  };

  if (isProfileDataLoading) return <h1>Profile is Loading....</h1>;

  const { user } = data;

  return (
    <div className="max-w-4xl mx-auto my-24 px-4 md:px-0 border-2">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage
              src={user?.photoUrl || "https://github.com/shadcn.png"}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Name:{" "}
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.name}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Email:{" "}
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.email}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Role:{" "}
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.role.toUpperCase()}
              </span>
            </h1>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="mt-2">
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Upload Profile Photo
                </Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  className="col-span-3"
                  onChange={onChangeHandler}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={updateUserIsLoading}
                onClick={updateUserHandler}
              >
                {updateUserIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <h1 className="font-medium text-lg">Courses you're enrolled in</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {user?.enrolledCourses?.length === 0 ? (
            <h1>You haven't enrolled yet</h1>
          ) : (
            user?.enrolledCourses?.map((course) => {
              return <Course key={course._id} />;
            })
          )}
        </div>
      </div>
    </div>
  );
}
