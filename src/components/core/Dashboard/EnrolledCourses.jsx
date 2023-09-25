import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from "react-router-dom";

const EnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState(null);

  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);
      setEnrolledCourses(res);

      console.log("enrolledCourses : " , res)
    } catch (error) {
      console.log("Could not fetch enrolled courses.")
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  return (
    <div className="text-white">
      <div>Enrolled Courses</div>
      {!enrolledCourses ? (
        <div>Loading...</div>
      ) : !enrolledCourses.length ? (
        <p>You have not enrolled in any course yet</p>
      ) : (
        <div>
          <div>
            <p>Course Name</p>
            <p>Duration</p>
            <p>Progress</p>
          </div>

          {/* Cards start here */}
          {enrolledCourses.map((course, index) => {
            return (
              <div key={index}>
                <div
                  onClick={() =>
                    navigate(
                      `/view-course/${course?._id}/section/${course?.courseContent?.[0]?._id}/sub-section/${course?.courseContent?.[0]?.subSection?.[0]}`
                    )
                  }
                >
                  <img src={course.thumbnail} alt="Course_pic" />
                  <div>
                    <p> {course.courseName} </p>
                  </div>
                </div>

                <div>{course?.totalDuration}</div>

                <div>
                  <p>Progress : {course.progressPercentage || 0}% </p>
                  <ProgressBar
                    completed={course.progressPercentage || 0}
                    height="8px"
                    isLabelVisible={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
