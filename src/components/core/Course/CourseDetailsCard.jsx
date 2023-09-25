import copy from "copy-to-clipboard";
import React from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { addToCart } from "../../../slices/cartSlice";

const CourseDetailsCard = ({
  course,
  setConfirmationModal,
  handleBuyCourse,
}) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // here after giving ':' and giving another name renames the variable
  const { thumbnail: thumbnailImage, price: currentPrice } = course;

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor, you can't buy a course");
      return;
    }

    if (token) {
      dispatch(addToCart (course) );
      return;
    }

    setConfirmationModal({
      text1: "You are not logged in",
      text2: "Please login to add to cart",
      btn1Text: "login",
      btn2Text: "cancel",
      btn1Handler: () => {navigate("/login");},
      btn2Handler: () => setConfirmationModal(null  ),
    });
  };

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link Copied to Clipboard");
  };

  return (
    <div>
      <img
        alt="thumbnail"
        src={thumbnailImage}
        className="max-h-[300px] min-h-[180px] w-[400px] rounded-xl "
      />
      <div>Rs. {currentPrice}</div>

      <div className="flex flex-col gap-y-6">
        <button
          className=" bg-yellow-50 text-richblack-900 "
          onClick={
            user && course?.studentsEnrolled?.includes(user?._id)
              ? () => {
                  navigate("/dashboard/enrolled-courses");
                }
              : handleBuyCourse
          }
        >
          {user && course?.studentsEnrolled?.includes(user?._id)
            ? " Go to Course"
            : " Buy Now"}
        </button>

        {!course?.studentsEnrolled?.includes(user?._id) && (
          <button
            onClick={handleAddToCart}
            className=" bg-yellow-50 text-richblack-900"
          >Add to Cart</button>
        )}
      </div>

      <div>
        <p>30 daymoney-back Guarantee</p>
        <p>This Course Includes :</p>

        <div className=" flex flexcol gap-y-3">
          {" "}
          {course?.instructions?.map((item, index) => {
            return (
              <p className="flex gap-2" key={index}>
                {item}
              </p>
            );
          })}{" "}
        </div>
      </div>

      <div>
        <button
          className="mx-auto flex items-center gap-2 text-yellow-50"
          onClick={handleShare}
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default CourseDetailsCard;
