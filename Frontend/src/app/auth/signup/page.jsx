"use client";

import Header from "@/app/component/common/Header";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [authMessage, setAuthMessage] = useState("");

  const onSubmit = () => {
    setAuthMessage("Account creation is unavailable until an authentication provider is configured.");
  };

  return (
    <>
      <Header />

      <main className="min-h-screen w-full bg-[#faecdc] px-4 py-8 sm:px-6 flex justify-center items-start font-mono">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md rounded-[15px] border border-gray-300 bg-[#FFF5E9] p-5 sm:p-7 flex flex-col gap-5 text-[#292929] shadow-sm"
        >
          <h2 className="text-3xl text-left capitalize">
            Sign up
          </h2>

          {/* Username */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="userName"
              className="font-semibold text-gray-500"
            >
              Username
            </label>

            <input
              type="text"
              id="userName"
              placeholder="username"
              autoComplete="username"
              className="w-full h-10 rounded border border-gray-400 bg-white px-3 font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
              {...register("userName", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
              })}
            />

            {errors.userName && (
              <p className="text-sm font-medium text-red-600">
                {errors.userName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="emailId"
              className="font-semibold text-gray-500"
            >
              Email ID
            </label>

            <input
              type="email"
              id="emailId"
              placeholder="example@aazam.com"
              autoComplete="email"
              className="w-full h-10 rounded border border-gray-400 bg-white px-3 font-medium lowercase focus:outline-none focus:ring-2 focus:ring-green-500"
              {...register("emailId", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email address",
                },
              })}
            />

            {errors.emailId && (
              <p className="text-sm font-medium text-red-600">
                {errors.emailId.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="font-semibold text-gray-500"
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              placeholder="password"
              autoComplete="new-password"
              className="w-full h-10 rounded border border-gray-400 bg-white px-3 font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />

            {errors.password && (
              <p className="text-sm font-medium text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-3xl bg-[#50b863] px-4 font-semibold capitalize text-white transition-colors hover:bg-[#419e52] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>

          {authMessage && (
            <p className="text-center text-sm text-amber-800" role="status">
              {authMessage}
            </p>
          )}

          <p className="text-center text-xs">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-blue-700 underline hover:text-blue-900"
            >
              Login
            </Link>
          </p>
        </form>
      </main>
    </>
  );
};

export default Page;
