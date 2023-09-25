import React from "react";
import HighLightText from "./HighLightText";
import knowYourProgress from "../../../assets/Images/Know_your_progress.png";
import comparewithOthers from "../../../assets/Images/Compare_with_others.png";
import planYourLessons from "../../../assets/Images/Plan_your_lessons.png";
import { CTAButton } from "./CTAButton";

export const LearningLanguageSection = () => {
  return (
    <div className="mt-[130px] mb-28">
      <div className=" flex flex-col gap-5 items-center">
        <div className="text-4xl font-semibold text-center">
          Your Swiss Knife for
          <HighLightText text={" learning any language"} />
        </div>

        <div className=" font-medium w-[70%] text-center text-richblack-600 mx-auto text-base">
          Using spin making learning multiple languages easy with 20+ languages
          realistic voice-over, progress-tracking, custom schedule and more...
        </div>

        <div className=" flex items-center justify-center mt-5 ">
          <img
            src={knowYourProgress}
            alt="knowYourProgress"
            className="object-contain -mr-32 "
          />
          <img
            src={comparewithOthers}
            alt="comparewithOthers"
            className="object-contain"
          />
          <img
            src={planYourLessons}
            alt="planYourLessons"
            className="object-contain -ml-36"
          />
        </div>

        <div className="w-fit ">
          <CTAButton active={true} linkto={"/signup"}>
            {" "}
            <div>Learn More</div>{" "}
          </CTAButton>
        </div>
      </div>
    </div>
  );
};
