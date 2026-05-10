import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../store/useAuth.store";
import axiosInstance from "../../utils/axios";
import { data } from "react-router-dom";

const schema = z.object({
  bio: z.string().max(150, "Max 150 characters").optional(),
  gender: z.enum(["Prefer not to say", "Male", "Female"]).optional(),
});

const EditProfile = () => {
  const authUser = useAuthStore((s) => s.authUser);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      bio: authUser?.bio,
      gender: authUser?.gender,
    },
  });

  const bioValue = watch("bio") || "";

  const onSubmit = async (formData) => {
    if (authUser.bio === formData.bio && authUser.gender === formData.gender)
      return;
    console.log(formData);
    try {
      const { data } = await axiosInstance.patch(`/users/`, formData);
      console.log(data);
      data.success;
    } catch (error) {
      console.log(error);
    }
    // const filetedData = data.map(element => console.log(element))
    // console.log(filetedData)
  };

  const [avatar, setAvatar] = React.useState(authUser?.avatar);

  const changePhoto = () => {
    const url = prompt("Enter image URL:");
    if (url) setAvatar(url);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 flex justify-center pt-6 sm:pt-10">
      <div className="w-full max-w-[500px]">
        <h1 className="text-2xl mb-5">Edit Profile</h1>

        {/* Profile Card */}
        <div className=" bg-[#1a1a1a] p-4 rounded-xl flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between sm:items-center mb-6">
          <div className="flex items-center gap-3">
            <img src={avatar} className="w-14 h-14 rounded-full object-cover" />
            <div>
              <div className="font-semibold">{authUser?.username}</div>
              <div className="text-sm text-gray-400">{authUser?.name}</div>
            </div>
          </div>
          <button
            onClick={changePhoto}
            className="bg-indigo-600 px-4 py-2 rounded-lg text-sm"
          >
            Change photo
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Bio */}
          <div className="mb-5">
            <label className="block text-sm text-gray-300 mb-2">Bio</label>
            <textarea
              {...register("bio")}
              maxLength={150}
              placeholder="Bio"
              className="w-full p-3 h-24 rounded-lg bg-[#1a1a1a] outline-none resize-none"
            />
            <div className="flex justify-between text-xs mt-1">
              <span className="text-red-400">{errors.bio?.message}</span>
              <span className="text-gray-400">{bioValue.length} / 150</span>
            </div>
          </div>

          {/* Gender */}
          <div className="mb-6">
            <label className="block text-sm text-gray-300 mb-2">Gender</label>
            <select
              {...register("gender")}
              className="w-full p-3 rounded-lg bg-[#1a1a1a] outline-none"
            >
              <option>Prefer not to say</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 py-3 rounded-xl font-medium"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
