import React from "react";

import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";

import timelineImage from "../../../assets/Images/TimelineImage.png";

export const TimeLineSection = () => {
  const timeline = [
    {
      Logo: Logo1,
      heading: "Leadership",
      Description: "Fully commited to the success of company",
    },
    {
      Logo: Logo2,
      heading: "Responsibility",
      Description: "Students are always our top priority",
    },
    {
      Logo: Logo3,
      heading: "Flexibility",
      Description: "Ability to switch is important ability",
    },
    {
      Logo: Logo4,
      heading: "Solve the Problem",
      Description: "Code your to the solution",
    },
  ];

  return (
    <div>
      <div className="flex gap-15 items-center ">
        <div className="flex flex-col w-[45%] gap-5">
          {timeline.map((element, index) => {
            return (
              <div className="flex gap-6" key={index}>
                <div className="w-[50px] h-[50px] bg-white flex items-center justify-center rounded-full ">
                  <img src={element.Logo} alt="Logo" />
                </div>

                <div>
                  <h2 className="font-semibold text-[18px] ">
                    {element.heading}
                  </h2>
                  <p className="text-base"> {element.Description} </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative shadow-blue-200">
          <img
            src={timelineImage}
            alt="timelineImage"
            className=" shadow-white object-cover h-fit"
          />

          <div className="absolute bg-caribbeangreen-700 flex text-white uppercase py-7 rounded-md left-[50%] translate-x-[-50%] translate-y-[-50%] ">
            <div className="flex gap-5 items-center border-r border-caribbeangreen-300 px-7 ">
              <p className="text-3xl font-bold">10</p>
              <p className="text-caribbeangreen-300 text-sm">
                years of experience
              </p>
            </div>

            <div className="flex gap-5 items-center px-7 ">
              <p className="text-3xl font-bold">250</p>
              <p className="text-caribbeangreen-300 text-sm">type of courses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
