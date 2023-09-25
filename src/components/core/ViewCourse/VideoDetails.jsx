import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import { AiFillPlayCircle } from "react-icons/ai";

import "video-react/dist/video-react.css"; // import css
import { Player } from "video-react";
import IconBtn from "../../common/IconBtn";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const playerRef = useRef();
  const { token } = useSelector((state) => state.auth);

  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);
  const location = useLocation();
  const [ videoData, setVideoData ] = useState([]);

  const [videoEnded, setVideoEnded] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setVideoSpecificDetails = async () => {
      if (!courseSectionData.length) return;

      if (!courseId && !subSectionId && !sectionId) {
        navigate("/dashboard/enrolled-courses");
      }

      // console.log("courseSectionData" , courseSectionData)

      // console.log("Form Params : courseId: " ,courseId," subSectionId " ,subSectionId," sectionId ",sectionId )
      // lets assume all three field are present
      const filteredData = courseSectionData.filter(
        (course) => course?._id === sectionId
      );

      console.log("Filtered Data" , filteredData)

      const filteredVideoData = filteredData?.[0].subSection.filter(
        (data) => data._id === subSectionId
      );
      
      // console.log("Filtered VIDEO Data" , filteredVideoData)
      setVideoData(filteredVideoData);
      console.log("VideoDATA : " , videoData)
      setVideoEnded(false);
    };
    setVideoSpecificDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionData, courseEntireData, location.pathname]);

  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId);

    // check the conditions for the first index
    if (currentSectionIndex === 0 && currentSubSectionIndex === 0) {
      return true;
    }

    return false;
  };

  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    console.log("INSIDE LAST VIDEO FUNCTION")
    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId);

    console.log("currentSubSectionIndex" , currentSubSectionIndex)
    const noOfSubSections =
      courseSectionData[currentSectionIndex].subSection.length;

      console.log("noOfSubSections" , noOfSubSections)
    // check the conditions for last index
    if (
      currentSectionIndex === courseSectionData.length - 1 &&
      currentSubSectionIndex === noOfSubSections - 1
    ) {
      return true;
    }

    return false;
  };

  const goToNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId);

    const noOfSubSections =
      courseSectionData[currentSectionIndex].subSection.length;

    if (currentSubSectionIndex !== noOfSubSections - 1) {
      // the same section contains next videos
      const nextSubSectionId =
        courseSectionData[currentSectionIndex].subSection[
          currentSubSectionIndex + 1
        ]._id;

      // go to next video
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      );
    } else {
      // next section first SubSection
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
      const firstSubSectionId_ofNextSubSection =
        courseSectionData[currentSectionIndex + 1].subSection[0]._id;
      // go to this video
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${firstSubSectionId_ofNextSubSection}`
      );
    }
  };

  const goToPreviousVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId);

    const noOfSubSections =
      courseSectionData[currentSectionIndex].subSection.length;

    if (currentSubSectionIndex !== 0) {
      // same section, previous video
      const prevSubSectionId =
        courseSectionData[currentSectionIndex].subSection[
          currentSubSectionIndex - 1
        ];
      // go to the video
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      );
    } else {
      // previous section last subsection
      const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;

      const prevSection_lastSubSectionIndex =
        courseSectionData[currentSectionIndex - 1].subSection.length;
      const prevSubSectionId_ofLastSection =
        courseSectionData[currentSectionIndex - 1].subSection[
          prevSection_lastSubSectionIndex - 1
        ]._id;

      // go to the video
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId_ofLastSection}`
      );
    }
  };

  const handleLectureCompletion = async () => {
    // dummy code, later we will replace with the actual call

    setLoading(true);

    const res = await markLectureAsComplete(
      { courseId: courseId, subSectionId: subSectionId },
      token
    );

    // state update
    if (res) {
      dispatch(updateCompletedLectures(subSectionId));
    }

    setLoading(false);
  };

  return (
    <div className="text-white">
      { !videoData ? (
        <div>No Lecture video Found</div>
      ) : (
        <div>
          <Player
            ref={playerRef}
            aspectRatio="16:9"
            playsInline
            onEnded={() => {
              setVideoEnded(true);
            }}
            src={videoData?.[0]?.videoUrl}
          >
            <AiFillPlayCircle />

            {videoEnded && (
              <div>
                {!completedLectures.includes(subSectionId) && (
                  <IconBtn
                    disabled={loading}
                    onclick={() => {
                      handleLectureCompletion();
                    }}
                    text={!loading ? "Mark As Completed" : "Loading...."}
                  />
                )}

                <IconBtn
                  disabled={loading}
                  onclick={() => {
                    if (playerRef?.current) {
                      playerRef.current?.seek(0);

                      setVideoEnded(false);
                    }
                  }}
                  text={"Replay"}
                  customClasses={"text-xl"}
                />

                {/* previous and next button */}
                <div>
                  {!isFirstVideo() && (
                    <button
                      disabled={loading}
                      onClick={goToPreviousVideo}
                      className="blackButton text-caribbeangreen-500 bg-pink-400"
                    >
                      Prev
                    </button>
                  )}
                  {!isLastVideo() && (
                    <button
                      disabled={loading}
                      onClick={goToNextVideo}
                      className="blackButton  text-caribbeangreen-500 bg-pink-400"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </Player>
        </div>
      )}

      <h1>{videoData?.[0]?.title}</h1>
      <p> {videoData?.[0]?.description} </p>
    </div>
  );
};

export default VideoDetails;
