const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

// create Rating
exports.createRating = async (req, res) => {
  try {
    // get user id
    const userId = req.user.id;
    // fetch data from req body
    const { rating, review, courseId } = req.body;

    // check if user is enrolled or not
    const courseDetails = await Course.findOne(
      { _id: courseId },
      { studentsEnrolled: { $elemMatch: { $eq: userId } } }
    );

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in the course",
      });
    }

    // check if already reviewed or not
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is Already Reviewed By the User",
      });
    }
    // create Rating and review
    const ratingReview = await RatingAndReview.create({
      rating: rating,
      review: review,
      course: courseId,
      user: userId,
    });

    // update Course
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      userId,
      {
        $push: { ratingAndReviews: ratingReview._id },
      },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Review and Rating Added Successfully",
      ratingReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "COULD NOT ADD Review and Rating Added Successfully",
    });
  }
};

// get Average Rating
exports.getAverageRating = async (req, res) => {
  try {
    // get course id
    const courseId = req.body.courseId;

    // calculate the average rating
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    // return rating
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }
    // if no rating exist
    else {
      return res.status(200).json({
        success: true,
        message: "Average Rating is 0, no ratings given till now",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// getAllRating
exports.getAllRating = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({ path: "user", select: "firstName lastName email image" })
      .populate({ path: "course", select: "courseName" })
      .exec();

    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: allReviews,
    });


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "COULD NOT GET Review and Rating Added Successfully",
    });
  }
};

