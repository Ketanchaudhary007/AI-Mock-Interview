import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const HeroSection = () => {
  return (
    <>
      <div className="bg-gray-950 p-6 md:p-12 flex flex-col md:flex-row gap-7 ">
        <Image
          src="/interview.jpg"
          alt="myInterviewImage"
          width={300}
          height={300} // Maintain the correct aspect ratio
          className="rounded-xl"
          style={{
            // boxShadow: "0px 0px 43px -12px rgba(216, 216, 221, 1)",
          }}
        
        />
        <div className="w-full rounded-xl p-4 md:p-8">
          <h2 className="text-white text-[22px] md:text-[35px] font-extrabold">
            Empowering Your Career with AI MOCK INTERVIEWER
          </h2>
          <label className="text-gray-400 font-bold">
            Practice interviews like never before
          </label>
          <p className="text-cyan-100 w-full md:w-[700px] mt-6">
            The power of AI to transform your career growth with AI-driven mock
            interviews and personalized feedback.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 my-7">
            <Link href="/dashboard">
              <Button className="rounded-lg bg-cyan-500 hover:bg-cyan-700 flex items-center font-semibold text-base justify-center">
                Get Started
                <img
                  src="rightarrow.svg"
                  alt="rightarrow"
                  width={35}
                  className="mml-5"
                />
              </Button>
            </Link>

          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
