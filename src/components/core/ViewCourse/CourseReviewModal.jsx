import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import IconBtn from "../../common/IconBtn";
import { createRating } from "../../../services/operations/courseDetailsAPI";

const CourseReviewModal = ({ setReviewModal }) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { courseEntireData } = useSelector((state) => state.viewCourse);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token
    );

    setReviewModal(false);
      
  };

  useEffect(() => {
    setValue("courseExperience", "");
    setValue("courseRating", 0);
  }, []);

  const ratingChanged = (newRating) => {
    setValue("courseRating", newRating);
  };

  return (
    <div>
      <div>
        {/* Modal HEader */}
        <div>
          <p> Add Review </p>
          <button
            onClick={() => {
              setReviewModal(false);
            }}
          >
            {" "}
            Close{" "}
          </button>
        </div>

        {/* Modal body */}

        <div>
          <div>
            <img
              src={user?.image}
              alt="profile_image"
              className="aspect-square w-12 object-cover "
            />
            <div>
              <p>
                {" "}
                {user?.firstName} {user?.lastName}{" "}
              </p>
              <p> Posting Publicly </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col items-center"
          >
            <ReactStars
              count={5}
              onChange={ratingChanged}
              size={24}
              activeColor={"#ffd700"}
            />

            <div>
              <label htmlFor="courseExperience">Add Your Experience</label>
              <textarea
                id="courseExperience"
                placeholder="Add Your Course Experience"
                {...register("courseExperience", { required: true })}
              />
              {errors.courseExperience && (
                <span>Please Add Your Experience</span>
              )}
            </div>

            {/* cancel  and sae button */}
            <div>
              <button onClick={() => setReviewModal(false)}>Cancel</button>
              <IconBtn text={"save"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseReviewModal;
