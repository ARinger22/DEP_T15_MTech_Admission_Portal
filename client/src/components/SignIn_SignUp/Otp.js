import { LockClosedIcon, BellIcon } from "@heroicons/react/solid";
import React from "react";
import spinner from "../../images/SpinnerWhite.gif";
import { Link } from "react-router-dom";

export default function Otp(props) {
  const handleSubmit = (event) => {
    event.preventDefault();
    props.onClick();
  };

  return (
    <>
      <div className="pt-28 sm:pt-2 bg-gray-100 ">
        <div className="relative min-h-screen flex flex-col sm:justify-center items-center w-4/5 mx-auto sm:w-3/5 md:w-3/5">
          <div className="relative sm:max-w-md w-full">
            <div className="flex absolute justify-center items-center content-center bg-gradient-to-br from-[#6F8BD6] to-[#1E3A8A] shadow-md hover:shadow-lg h-48 w-48 -left-24 -top-24 rounded-full fill-current text-white">
              <span className="relative -top-4 -left-4 font-josefin-sans text-2xl font-bold">
                OTP
              </span>
            </div>
            <div className="card bg-[#1E3A8A] shadow-lg w-full h-full rounded-3xl absolute transform -rotate-6" />
            <div className="card bg-[#6F8BD6] shadow-lg w-full h-full rounded-3xl absolute transform rotate-6" />
            <div className="p-16 relative w-full rounded-3xl bg-white shadow-md">
              <label className="block mt-3 text-2xl text-gray-700 text-center font-semibold">
                Welcome to IIT Ropar
              </label>

              <p className="text-center mt-2 text-sm text-gray-500">
                Please enter otp to submit your applications for admission.
              </p>
              <div className="flex text-center justify-center">
                <span>
                  <BellIcon className="h-5 w-5 mx-1 text-red-500 group-hover:text-indigo-400" />
                </span>
                {props.colorChange === 0 && (
                  <p
                    className={"mb-10 text-center text-sm font-semibold text-[#6F8BD6]"}
                  >
                    {props.msg}
                  </p>
                )}
                {props.colorChange === 1 && (
                  <p
                    className={"mb-10 text-center text-sm font-semibold text-[#FC4F4F]"}
                  >
                    {props.msg}
                  </p>
                )}
                {props.colorChange === 2 && (
                  <p
                    className={"mb-10 text-center text-sm font-semibold text-[#39962d]"}
                  >
                    {props.msg}
                  </p>
                )}
              </div>
              <form className="mt-2" onSubmit={handleSubmit}>
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="mb-2 rounded shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="otp" className="sr-only">
                      OTP
                    </label>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      autoComplete="otp"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="OTP"
                      onChange={props.updateOTP}
                    />
                  </div>
                </div>

                <div className="mb-2 rounded shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="password" className="sr-only">
                      New Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                      onChange={props.updatePass}
                    />
                  </div>
                </div>

                <div className="mb-2 rounded shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="confirm-password" className="sr-only">
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      autoComplete="confirm-password"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Confirm Password"
                      onChange={props.updateCnfPass}
                    />
                  </div>
                </div>

                <div className="mb-6 text-sm text-right items-end">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                    onClick={props.resendOTP}  >
                    Resend OTP?
                  </a>
                </div>

                <div>
                  {!props.isLoading ? (
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <LockClosedIcon
                          className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                          aria-hidden="true"
                        />
                      </span>
                      Validate
                    </button>
                  ) : (
                    <button
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      type="button"
                      disabled
                    >
                      <div className="w-20 h-5">
                        <img className="h-5 w-5 mx-auto" alt="spinner" src={spinner} />
                      </div>
                    </button>
                  )}
                </div>
              </form>
              <div className="flex mt-7 items-center text-center">
                <hr className="border-gray-300 border-1 w-full rounded-md" />
              </div>
              <div className="mt-7">
                <div className="flex justify-center items-center">
                  <label className="mr-2">Already have an account? </label>
                  <Link
                    to="/sign-in"
                    className=" text-blue-500 transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105"
                  >
                    Log-in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
