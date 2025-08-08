import { useState } from "react";
import SignInForm from "../../components/Auth/SignInForm";
import SignUpForm from "../../components/Auth/SignUpForm";

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div>
      <div className=" flex flex-col justify-center items-center py-15 ">
        <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          {isSignIn ? "Sign in to your account" : "Sign Up"}
        </h2>

        {isSignIn ? <SignInForm /> : <SignUpForm />}

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
