// Login.js
import axiosClient from "../lib/axios-client.js";
import { createRef, useState } from "react";
import { useStateContext } from "../context/ContextProvider.jsx";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@ui/alert-dialog";

const ErrorAlert = ({ alertOpen, setAlertOpen, message }) => {
  return (
    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Error</AlertDialogTitle>
          <AlertDialogDescription>
            {message ? message : "Something went wrong"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default function Login() {
  const emailRef = createRef();
  const passwordRef = createRef();
  const { setUser, setToken, setCurrentTeam, setTeams } = useStateContext();
  const [message, setMessage] = useState(null);
  const [looding, setLooding] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLooding(true);
    axiosClient
      .post("/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
        setCurrentTeam(data.teams[0].id);
        setTeams(data.teams);
        localStorage.setItem("SESSION_EMAIL", data.user.email);
      })
      .then(() => setLooding(false))
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setMessage(response.data.message);
          setAlertOpen(true);
        }
        setLooding(false);
      });
  };

  return (
    <div
      className="bg-no-repeat bg-cover bg-center relative"
      style={{
        backgroundImage: `url(https://www.ismartrecruit.com/upload/blog/main_image/boost-employee-productivity.webp)`,
      }}
    >
      <div className="absolute bg-gradient-to-b from-red-500 to-red-400 opacity-75 inset-0 z-0"></div>
      <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
        <div className="flex-col flex self-center p-10 sm:max-w-5xl xl:max-w-2xl z-10">
          <div className="self-start hidden lg:flex flex-col text-white">
            <h1 className="mb-3 font-bold text-5xl">Welcome to Admin Page</h1>
            <p className="pr-3">
              A strong team can take any crazy vision and turn it into reality.
            </p>
          </div>
        </div>
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-white mx-auto rounded-2xl w-100 ">
            <div className="mb-4">
              <h3 className="font-semibold text-2xl text-gray-800">Sign In </h3>
              <p className="text-gray-500">Please sign in to your account.</p>
              <div className="alert text-error text-red-500">
                <p>{message}</p>
              </div>
            </div>
            <form onSubmit={onSubmit}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 tracking-wide">
                    Email
                  </label>
                  <input
                    className="w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                    type="email"
                    ref={emailRef}
                    placeholder="admin@novatechset.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                    Password
                  </label>
                  <input
                    className="w-full content-center text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                    type="password"
                    ref={passwordRef}
                    placeholder="Enter your password"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember_me"
                      name="remember_me"
                      type="checkbox"
                      className="h-4 w-4 bg-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember_me"
                      className="ml-2 text-sm text-gray-400"
                    >
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="text-red-400 hover:text-red-500"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                <div>
                  <Button
                    disabled={looding}
                    type="submit"
                    className="w-full flex justify-center bg-red-400 hover:bg-red-500 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                  >
                    {looding ? "Loading..." : "Sign in"}
                  </Button>
                </div>
              </div>
            </form>
            <div className="pt-5 text-center text-gray-400 text-xs">
              <span>Copyright © {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
      <ErrorAlert
        alertOpen={alertOpen}
        setAlertOpen={setAlertOpen}
        message={message}
      />
    </div>
  );
}
