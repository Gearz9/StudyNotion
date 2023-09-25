import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import HighLightText from "./HighLightText";
import CourseCard from "./CourseCard";

const tabNames = [
  "Free",
  "New To coding",
  "Most popular",
  "Skill Paths",
  "Career paths",
];

export const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabNames[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  const setMyCards = (value) => {
    setCurrentTab(value);

    const result = HomePageExplore.filter((course) => course.tag === value);

    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  };

  return (
    <div>
      <div className=" text-4xl font-semibold text-center ">
        Unlock the <HighLightText text={"Power Of Code"} />
      </div>

      <p className=" text-center text-richblack-300 text-[16px]  mt-3 ">
        learn to build anything you can imagine
      </p>

      <div className="flex rounded-full bg-richblue-800 mb-5 mt-5 px-1 py-1">
        {tabNames.map((element, index) => {
          return (
            <div
              className={`text-[16px]  flex items-center gap-2 ${
                currentTab === element
                  ? "bg-richblack-900 text-richblack-5 font-medium"
                  : "text-richblack-200"
              } rounded-full transition-all duration-200 cursor-pointer hover:bg-richblue-900 hover:text-richblack-5 px-7 py-2`}
              key={index}
              onClick={() => {
                setMyCards(element);
              }}
            >
              {element}
            </div>
          );
        })}
      </div>

      <div className=" lg:h-[150px]"></div>

      {/* Cards Group */}
      <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
        {courses.map((ele, index) => {
          return (
            <CourseCard
              key={index}
              cardData={ele}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
            />
          );
        })}
      </div>


    </div>
  );
};
