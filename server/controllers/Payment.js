const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");

const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");
// initiate the razorpay order
exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  // validation
  if (courses.length === 0) {
    return res.json({ success: false, message: "Please Provide Course_Id" });
  }

  let totalAmount = 0;

  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);

      if (!course) {
        return res.status(200).json({
          success: false,
          message: "Could Not find the course",
        });
      }

      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({
          success: false,
          message: "Student is already enrolled",
        });
      }

      totalAmount += course.price;
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Error in capturePayment",
        error: error.message,
      });
    }
  }

  const options = {
    amount: totalAmount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  };

  try {
    const paymentResponse = await instance.orders.create(options);
    res.json({
      success: true,
      message: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Could not initiate Order",
    });
  }
};

// verify the payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;

  const courses = req.body?.courses;

  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({
      success: false,
      message: "Empty Fields, PAYMENT FAILED",
    });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // enroll student to the course
    await enrollStudent(courses, userId, res);

    // return response

    return res.status(200).json({ success: true, message: "Payment verified" });
  }

  return res.status(200).json({ success: false, message: "Payment Failed" });
};

const enrollStudent = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide data for courses and userid",
    });
  }

  for (const courseId of courses) {
    // find the course and enroll the student in it

    try {
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "Error in enrollStudent , course not found",
        });
      }

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      // find the student and add the courses to their list of enrolledCourses
      const enrolledStudent = await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { courses: courseId , courseProgress:courseProgress._id } },
        { new: true }
      );

      // send mail to the student
      const emailRespnse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.name} `,
        courseEnrollmentEmail(enrolledCourse.name, `${enrollStudent.firstName}`)
      );
      console.log("Email Sent successfully for course Enrollment");
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Error in enrollStudent function" });
    }
  }
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please  provide all the fields" });
  }

  try {
    // find the student

    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      `Payment Recieved`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.log("Error in sending Email", error);
    return res.status(500).json({
      success: false,
      message: "Could not send email",
    });
  }
};

/************************** this is eariler code for single course purchase ****************************************/

// // capture the payment and initiate the Razorpay Order

// exports.capturePayment = async (req, res) => {
//   try {
//     // get course ID and user ID
//     const { course_id } = req.body;
//     const user_id = req.user.id;

//     // validation
//     // valid CourseID
//     if (!course_id) {
//       return res.json({
//         success: false,
//         message: "Please provide valid course ID",
//       });
//     }

//     // valid CouresDetails
//     let course;
//     try {
//       course = await Course.findById(course_id);

//       if (!course) {
//         return res.json({
//           success: false,
//           message: "No such Course Found",
//         });
//       }

//       // user already payed or not for the course

//       // --we have user id in form of string we need to convert it into OBJECTID
//       const uid = new mongoose.Types.ObjectId(user_id);
//       if (course.studentsEnrolled.includes(uid)) {
//         // student is already enrolled
//         return res.status(200).json({
//           success: false,
//           message: "Student is Already Enrolled",
//         });
//       }
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }

//     // order create
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//       amount: amount * 100,
//       currency: currency,
//       receipt: Math.random(Date.now()).toString(),
//       notes: {
//         courseId: course_id,
//         user_id,
//       },
//     };

//     try {
//       // initiate the payment using razorpay
//       var paymentResponse = await instance.orders.create(options);

//       console.log(paymentResponse);
//     } catch (error) {
//       console.log(error);
//       res.json({
//         success: false,
//         message: "Could Not Initiate Order",
//       });
//     }

//     // return response
//     return res.status(200).json({
//       success: true,
//       courseName: course.name,
//       courseDescription: course.courseDescription,
//       thumbnail: course.thumbnail,
//       orderId: paymentResponse.id,
//       currency: paymentResponse.currency,
//       amount: paymentResponse.amount,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.json({
//       success: false,
//       message: "Could not initiate order",
//     });
//   }
// };

// // verify signature of razorpay
// exports.verifySignature = async (req, res) => {
//   const webhookSecret = "12345678";

//   const signature = req.headers["x-razorpay-signature"];

//   // Hmac means hashed based message authentication code
//   // Algorithm used here - SHA  (Secure hashing Algorithm) - cannot be decrypt

//   const shasum = crypto.createHmac("sha256", webhookSecret);
//   shasum.update(JSON.stringify(req.body));
//   const digest = shasum.digest("hex");

//   if (signature === digest) {
//     // Payment is Authorised

//     const { courseId, user_id } = req.body.payload.payment.entity.notes;

//     try {
//       // fulfill the action

//       // find the course and enroll the student in it
//       const enrollCourse = await Course.findOneAndUpdate(
//         { _id: courseId },
//         { $push: { studentsEnrolled: user_id } },
//         { new: true }
//       );

//       if (!enrollCourse) {
//         return res.status(500).json({
//           success: false,
//           message: "Course not Found",
//         });
//       }

//       console.log(enrollCourse);

//       //  find the student{User} and add the course in list of enrolled courses

//       const enrollStudent = await User.findOneAndUpdate(
//         { _id: user_id },
//         { $push: { courses: courseId } },
//         { new: true }
//       );

//       console.log(enrollStudent);

//       // send Mail of confirmation

//       const emailRespnse = await mailSender(
//         enrollStudent.email,
//         "Congratulations from StudyNotion ",
//         "Congratulations, you are onboarded into new StudyNotion Course"
//       );

//       console.log(emailRespnse);

//       return res.status(200).json({
//         success: false,
//         message: "Signature Verification and Course Added",
//       });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   } else {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid request",
//     });
//   }
// };
