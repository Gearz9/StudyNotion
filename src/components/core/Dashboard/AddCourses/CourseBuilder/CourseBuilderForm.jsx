import React, { useState } from "react";
import { useForm } from "react-hook-form";
import IconBtn from "../../../../common/IconBtn";
import { MdAddCircleOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { BiRightArrow } from "react-icons/bi";
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../slices/courseSlice";
import { toast } from "react-hot-toast";
import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI";
import NestedView from "./NestedView";

export const CourseBuilderForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [editSectionName, setEditSectionName] = useState(null);

  const { course } = useSelector((state) => state.course);

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  const dispatch = useDispatch();

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  const goToNext = () => {
    if (course?.courseContent?.length === 0) {
      toast.error("Please Add Atleast One Section");
      return;
    }
    if (
      course.courseContent.some((section) => section.subSection.length === 0)
    ) {
      toast.error("Please Add atleast one lecture in each section");
    }

    // now everything is good
    dispatch(setStep(3));
  };

  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    setLoading(true);

    let result;

    if (editSectionName) {
      // we are editing section name

      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
         token 
      );
    } else {
      // creating a new section
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      );
      console.log("result is : " , result)
    }

    // update values
    if (result) {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");

    }

    // loading false
    setLoading(false);
  };

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }

    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  return (
    <div className="text-white">
      <p>Course Builder</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="sectionName">
            Section Name <sup>*</sup>{" "}
          </label>
          <input
            id="sectionName"
            placeholder="Add Section Name"
            {...register("sectionName", { required: true })}
            className="w-full text-richblack-800"
          />
          {errors.sectionName && <span>Section Name is Required </span>}
        </div>

        <div className=" mt-10 flex w-full ">
          <IconBtn
            type="Submit"
            text={editSectionName ? "Edit Section Name " : "Create Section"}
            outline={true}
            customClasses={"text-white"}
          ><MdAddCircleOutline className=" text-yellow-50 inline " size={20} /></IconBtn>

        
          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline ml-10 "
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Nested view */}

      {course?.courseContent?.length > 0 && <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />}
            
      {/* Back and Next Button */}

      <div className="flex justify-end gap-x-3 mr-10">
        <button
          onClick={goBack}
          className="rounded-md cursor-pointer flex items-center"
        >
          Back
        </button>
        <IconBtn text="Next" onclick={goToNext} >  <BiRightArrow className="inline" /> </IconBtn>
      </div>
    </div>
  );
};
