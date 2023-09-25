import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighLightText from "../components/core/HomePage/HighLightText";
import { CTAButton } from "../components/core/HomePage/CTAButton";
import Banner from "../assets/Images/banner.mp4";
import { CodeBlocks } from "../components/core/HomePage/CodeBlocks";
import { TimeLineSection } from "../components/core/HomePage/TimeLineSection";
import { LearningLanguageSection } from "../components/core/HomePage/LearningLanguageSection";
import { InstructorSection } from "../components/core/HomePage/InstructorSection";
import { ExploreMore } from "../components/core/HomePage/ExploreMore";
import Footer from "../components/common/Footer";
import ReviewSlider from "../components/common/ReviewSlider";

const Home = () => {
  return (
    <div>
      {/* section 1 */}

      <div className=" relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white  justify-between">
        <Link to={"/signup"}>
          <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
            <div className="flex items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 hover:scale-95 group-hover:bg-richblack-900">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        <div className="text-center text-4xl font-semibold mt-7">
          Empower Your Future with <HighLightText text={"Coding Skills"} />{" "}
        </div>

        <div className="w-[90%] text-center font-bold text-lg text-richblack-300 mt-4">
          With our online coding, courses you can learn at your own place, from
          anywhere in the world, and get access to a wealth of resources,
          includinghands-on projects, quizzes, and personalized feedback from
          instructors
        </div>

        <div className="flex gap-7 mt-8">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>
          <CTAButton active={false} linkto={"/login"}>
            Book A Demo
          </CTAButton>
        </div>

        <div className=" mx-3 my-12 shadow-blue-200">
          <video muted loop autoPlay>
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* Code Section 1 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-bold">
                Unlock Your <HighLightText text={"coding potential"} /> with our
                online courses
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in codingand are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              btnText: "Try It Yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<!DOCTYPE html>\n<html>\n<head>\n<title>\nExample\n</title>\n</head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n</body>\n<nav><a href="one/">One</a><a href="two/">Two</a>\n<a href="three/">Three</a>\n</nav>\n</html>`}
            codecolor={`text-yellow-25`}
          />
        </div>

        {/* Code Section 2 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="text-4xl font-bold">
                Start <HighLightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try.Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Continue Lesson",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<!DOCTYPE html>\n<html>\n<head>\n<title>\nExample\n</title>\n</head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n</body>\n<nav><a href="one/">One</a><a href="two/">Two</a>\n<a href="three/">Three</a>\n</nav>\n</html>`}
            codecolor={`text-yellow-25`}
          />
        </div>

        <ExploreMore />
      </div>

      {/* Section 2 */}

      <div className="bg-pure-greys-5 text-richblack-700">
        <div className="homepage_bg h-[310px] ">
          <div className="w-11/12 max-w-maxContent flex flex-col items-center justify-center gap-5 mx-auto">
            <div className=" h-[150px]"></div>
            <div className="flex gap-7 text-white">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-3">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/signup"}>
                Learn More
              </CTAButton>
            </div>
          </div>
        </div>

        <div className=" mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7">
          <div className=" flex items-center gap-5 mb-10 mt-[95px]">
            <div className="text-4xl font-semibold font-inter w-[45%] ">
              Get the Skills you need for a{" "}
              <HighLightText text={"job that is in demand"} />
            </div>

            <div className="flex flex-col gap-10 w-[40%] items-start">
              <div className=" text-[16px]">
                The modern StudyNotion is the dictates in it's own terms. Today,
                to be competitive specialist requires more than professional
                skills.
              </div>
              <CTAButton active={true} linkto={"/signup"}>
                Learn More
              </CTAButton>
            </div>
          </div>

          <TimeLineSection />

          <LearningLanguageSection />
        </div>
      </div>

      {/* Section 3 */}
      <div className="w-11/12 mx-auto max-w-maxContent flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white ">
        <InstructorSection />

        <h2 className="text-center text-4xl font-semibold mt-10 ">
          Review From Other Learners
        </h2>

        {/* Review Slider */}

        <ReviewSlider/>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Home;
