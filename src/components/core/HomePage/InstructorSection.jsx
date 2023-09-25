import React from "react";
import instructor from "../../../assets/Images/Instructor.png";
import HighLightText from "./HighLightText";
import { CTAButton } from "./CTAButton";
import { FaArrowRight } from "react-icons/fa";

export const InstructorSection = () => {
  return (
    <div className="mt-16">
      <div className=" flex gap-20 items-center">
        <div className="w-[50%]">
          <img
            src={instructor}
            alt="instructorImage"
            className="shadow-white"
          />
        </div>

        <div className="w-[50%] flex flex-col gap-10">
          <div className="text-4xl w-[50%] font-semibold">
            Become an <HighLightText text={"Instructor"} />
          </div>
          <p className="font-medium text-[16px] w-[80%] text-richblack-300 ">
            Instructors from around the world teach millions of students on
            StudyNotion. We provide the tools and skills to teach what you love.
          </p>

          <div className="w-fit">
            <CTAButton active={true} linkto={"/signup"}>
              <div className="flex items-center gap-2 ">
                Start Learning Today
                <FaArrowRight />
              </div>
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
};
