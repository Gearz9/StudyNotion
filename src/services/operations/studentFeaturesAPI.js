import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import { SiRazorpay } from "react-icons/si";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

export async function buyCourse(
  token,
  courses,
  userDetails,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading...");

  try {
   
    // laod the script
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("Razorpay SDK failed to load ");
      return;
    }

    // initiate the order
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      { Authorization: `Bearer ${token}` }
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }

    console.log("ORder Response in buyCOurse ", orderResponse);

    // options
    const options = {
      key: process.env.RAZORPAY_KEY,
      currency: orderResponse.data.message.currency,
      amount: `${orderResponse.data.message.amount}`,
      order_id: orderResponse.data.message.id,
      name: "StudyNotion",
      description: "Thank You For Purchasing the Course",
      image: SiRazorpay,
      prefill: { name: `${userDetails.firstName}`, email: userDetails.email },
      handler: function (response) {
        // send successfull email
        sendPaymentSuccessEmail(
          response,
          orderResponse.data.message.amount,
          token
        );
        // verify the payment
        verifyPayment({ ...response, courses }, token, navigate, dispatch);
      },
    };

    // the payment object is to open the window of razorpay
    const paymentObject = new window.Razorpay(options);
    // open the windowObject
    paymentObject.open();
    // actions of paymentObject
    paymentObject.on("payment.failed", function (response) {
      toast.error("Oops, payment failed");
      console.log(response?.error);
    });
  } catch (error) {
    console.log("PAYMENT API ERROR......", error);
    toast.error("Could not make Payment");
  }

  toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      { Authorization: `Bearer ${token}` }
    );
  } catch (error) {
    console.log("Payment success email error...", error);
  }
}

// verify payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment....");

  dispatch(setPaymentLoading(true));
  
  try {





    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    });

    console.log("response in verify payment", response);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Payment Successfull, you are added to the course");

    navigate("/dashboard/enrolled-courses");

    dispatch(resetCart());
  } catch (error) {
    console.log("PAYMENT  VERIFY ERROR ..", error);
    toast.error("Could not verify payment");
  }

  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}
