import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { AiFillDelete, AiFillStar, AiOutlineStar } from "react-icons/ai";
import { removeFromCart } from "../../../../slices/cartSlice";

const RenderCartCourses = () => {
  const { cart } = useSelector((state) => state.cart);

  const dispatch = useDispatch()

  return (
    <div>
      {cart.map((course, index) => (
        <div>
          {/* left Part */}
          <div>
            <img src={course?.thumbnail} alt="course_image" />
            <div>
              <p> {course?.courseName} </p>
              <p> {course?.category?.name} </p>
              <div>
                <span>4.8</span>
                <ReactStars
                  count={5}
                  size={20}
                  edit={false}
                  activeColor="#ffd700"
                  filledIcon={<AiFillStar />}
                  emptyIcon={<AiOutlineStar />}
                />
                <span>{course?.ratingAndReviews?.length} Ratings</span>
              </div>
            </div>
          </div>

          {/* Right Part */}
          <div>
            <button onClick={ ()=> dispatch(removeFromCart(course._id)) }>
              <AiFillDelete /> <span>Remove</span>
            </button>

            <p>Rs {course?.price} </p>
          </div>


        </div>
      ))}
    </div>
  );
};

export default RenderCartCourses;
