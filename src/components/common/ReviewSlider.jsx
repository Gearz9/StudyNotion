import React from "react";
import { useEffect } from "react";
import { useState } from "react";

import { apiConnector } from "../../services/apiconnector";
import { ratingsEndpoints } from "../../services/apis";
import ReactStars from "react-rating-stars-component";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FaStar } from "react-icons/fa";
// import Autoplay from "swiper";
// import FreeMode from "swiper";
// import Navigation from "swiper";
// import Pagination from "swiper";

const ReviewSlider = () => {
  const [reviews, setReviews] = useState([]);
  const truncateWords = 15;

  useEffect(() => {
    const fetchAllReviews = async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      );

      if (data?.success) {
        setReviews(data?.data);
      }
    };

    console.log(reviews);

    fetchAllReviews();
  }, []);

  return (
    <div className=" bg-black">
      <div className="h-48 text-pink-600 max-w-maxContent ">
        <Swiper
          slidesPerView={4}
          spaceBetween={24}
          loop={true}
          freeMode={true}
          autoplay={{ delay: 2500 }}
          //   modules={[FreeMode, Pagination, Navigation]}
          className="w-full"
        >
          {reviews?.map((review, index) => (
            <SwiperSlide key={index}>
              <img
                alt="Profile_pic"
                src={review?.user?.image}
                className="h-9 w-9 object-cover rounded-full"
              />

              <p> {review?.user?.firstName} </p>
              <p> {review?.user?.lastName} </p>
              <p> {review?.course?.courseName} </p>

              <p>{review?.review}</p>

              <p> {review?.rating} </p>
              <ReactStars
                count={5}
                value={review?.rating}
                size={20}
                edit={false}
                activeColor={"#ffd700"}
                emptyIcon={<FaStar />}
                filledIcon={<FaStar />}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ReviewSlider;
