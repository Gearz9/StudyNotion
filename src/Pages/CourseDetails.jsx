import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BuyCourse } from "../services/operations/studentFeaturesAPI";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import GetAvgRating from "../utils/avgRating";
import { Error } from "./Error";
import ConfirmationModal from "../components/common/ConfirmationModal";
import RatingStars from "../components/common/RatingStars";
import { formatDate } from "../services/formatDate";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";

const CourseDetials = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { loading } = useSelector((state) => state.profile);
  const { paymentLoading } = useSelector((state) => state.course);

  const [confirmationModal, setConfirmationModal] = useState(null);

  const [isActive, setIsActive] = useState(Array(0));
  const handleActive = (id) => {
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat(id)
        : isActive.filter((e) => e !== id)
    );
  };

  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    const getCourseFullDetails = async () => {
      try {
        const result = await fetchCourseDetails(courseId);
        setCourseData(result);

        console.log("Course Data : ", courseData);
      } catch (error) {
        console.log("COULD NOT FETCH COURSE DETAILS");
      }
    };

    getCourseFullDetails();
  }, [courseId]);

  const [avgReviewCOunt, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(courseData?.data?.ratingAndReviews);

    setAvgReviewCount(count);
  }, [courseData]);

  const [totalNumberOfLectures, setTotalNoOfLectures] = useState(0);

  useEffect(() => {
    let lectures = 0;

    courseData?.data?.courseContent?.forEach((sec) => {
      lectures += sec?.subSection?.length || 0;
    });

    setTotalNoOfLectures(lectures);
  }, [courseData]);

  // TO UPDATE
  if (loading || !courseData) {
    return <div>Loading...</div>;
  }

  if (!courseData.success) {
    return (
      <div>
        {" "}
        <Error />{" "}
      </div>
    );
  }

  const handleBuyCourse = () => {
    if (token) {
      BuyCourse(token, [courseId], user, navigate, dispatch);
      return;
    }

    // user isnt logged in and trying to buy a course

    setConfirmationModal({
      text1: "You are not logged in",
      text2: "Please Login to Purchase a course",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  const {
    _id: course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = courseData?.data[0];

  return (
    <div className="flex flex-col  text-white mt-24 ">
      <div className="relative flex flex-col justify-start">
        <p> {courseName} </p>
        <p> {courseDescription} </p>

        <div className="flex gap-x-2">
          <span>
            <p> {avgReviewCOunt} </p>
          </span>
          <RatingStars Review_Count={avgReviewCOunt} Star_Size={24} />
          <span> {`${ratingAndReviews?.length} reviews`} </span>
          <span> {`${studentsEnrolled?.length} students enrolled `} </span>
        </div>

        <div>
          {" "}
          <p>
            Created By {`${instructor?.firstName} ${instructor?.lastName}`}{" "}
          </p>
        </div>

        <div className="flex gap-x-3">
          <p>Created at {formatDate(createdAt)}</p>
          <p>English</p>
        </div>

        <div>
          <CourseDetailsCard
            course={courseData?.data[0]}
            setConfirmationModal={setConfirmationModal}
            handleBuyCourse={handleBuyCourse}
          />
        </div>
      </div>

      <div>
        <p>What you will Learn</p>

        <div>{whatYouWillLearn}</div>
      </div>

      <div>
        <div>
          <p>Course Content</p>
        </div>

        <div className="flex gap-x-3 justify-between">
          <span> {courseContent?.length} section(s) </span>
          <span>{totalNumberOfLectures} lectures </span>
          <span>{courseData?.data?.totalDuration} total length </span>
        </div>

        <div>
          <button onClick={()=> setIsActive([])} > Collapse All Sections</button>
        </div>

      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CourseDetials;
