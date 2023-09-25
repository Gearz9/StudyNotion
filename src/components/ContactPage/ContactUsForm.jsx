import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../services/apiconnector";
import { contactusEndpoint } from "../../services/apis";

import CountryCode from "../../data/countrycode.json";

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstName: "",
        lastName: "",
        message: "",
        phoneNo: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  const submitContactForm = async (data) => {
    console.log("Logging Data", data);

    try {
      setLoading(true);
      //   const response = await apiConnector(
      //     "POST",
      //     contactusEndpoint.CONTACT_US_API,
      //     data
      //   );
      const response = { status: "ok" };
      console.log("Logging Response", response);
      setLoading(false);
    } catch (error) {
      console.log("ERROR ", error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitContactForm)}>
      <div className="flex flex-col gap-5">
        {/* first name and last name */}
        <div className=" flex gap-5">
          {/* firstName */}
          <div className="flex flex-col">
            <label htmlFor="firstName">First Name</label>

            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter First Name"
              {...register("firstName", { required: true })}
              className="text-richblue-900"
            />

            {errors.firstName && <span>Please Enter Your First Name</span>}
          </div>

          {/* lastName */}
          <div className="flex flex-col">
            <label htmlFor="lastName">Last Name</label>

            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter Last Name"
              {...register("lastName")}
              className="text-richblue-900"
            />

            {errors.firstName && <span>Please Enter Your First Name</span>}
          </div>
        </div>

        {/* email */}
        <div className="flex flex-col">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter Your Email"
            className="text-richblue-900"
            {...register("email", { required: true })}
          />
          {errors.email && <span>Please Enter Your Email Address </span>}
        </div>

        {/* Phone No. */}
        <div className="flex flex-col ">
          <label htmlFor="phoneNo">Phone Number</label>

          <div className=" flex gap-5">
            {/* drop down of Country Code */}

            {
              <select
                className="w-[80px] text-richblack-800 "
                name="dropDown"
                id="dropDown"
                {...register("countrycode", { required: true })}
              >
                {CountryCode.map((element, index) => {
                  return (
                    <option
                      key={index}
                      value={element.code}
                      className="text-white bg-richblack-800"
                    >
                      {element.code}-{element.country}
                    </option>
                  );
                })}
              </select>
            }

            {/* Phone Number */}

            <input
              type="number"
              name="phoneNo"
              id="phoneNo"
              placeholder="12345 67890"
              className="text-black w-[calc(100%-90px)]   "
              {...register("phoneNo", {
                required: {
                  value: true,
                  message: "Please Enter Phone Number",
                },
                maxLength: { value: 10, message: "Invalid Phone Number" },
                minLength: { value: 8, message: "Invalid Phone Number" },
              })}
            />
          </div>

          {errors.phoneNo && <span>{errors.phoneNo.message} </span>}
        </div>

        {/* message */}
        <div className="flex flex-col">
          <label htmlFor="message">Message</label>
          <textarea
            name="message"
            id="message"
            cols={30}
            rows={7}
            className="text-richblue-900"
            placeholder="Enter Your Message Here"
            {...register("message", { required: true })}
          />
          {errors.message && <span>Please Enter Your Message</span>}
        </div>

        {/* submit button */}
        <button
          type="submit"
          className="rounded-md bg-yellow-50 text-center px-6 text-[16px] font-bold text-black p-2 "
        >
          Send Message
        </button>
      </div>
    </form>
  );
};

export default ContactUsForm;
