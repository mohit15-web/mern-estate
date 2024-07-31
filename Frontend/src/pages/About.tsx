"use client";
import { Link } from "react-router-dom";
import { TypewriterEffectSmooth } from "../components/TypeWriterEffect";
function about() {
  const words = [
    {
      text: "Your",
    },
    {
      text: "Real",
    },
    {
      text: "Estate",
    },
    {
      text: "Experts.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-[40rem]  ">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
        The road to freedom starts from here
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <Link to="/">
        
        <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
          explore
        </button>
        </Link>
        <Link to="/sign-up">
          <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
            Signup
          </button>
        </Link>
      </div>
    </div>
  );
}

export default about;
