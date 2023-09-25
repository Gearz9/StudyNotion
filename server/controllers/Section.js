const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    // data fetch
    const { sectionName, courseId } = req.body;

    // data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
   
        message: "All Fields are requires",
      });
    }

    // create section
    const newSection = await Section.create({ sectionName });

    // update in Course schema {add section id}
    const updateCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      { $push: { courseContent: newSection._id } },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec(); //use populate to replace section/subsection both in updatecourseDetails

    // return response
    return res.status(200).json({
      success: true,
      message: "Section Created Successfully",
      updateCourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create section. Please Try Again",
      error: error.message,
    });
  }
};

// update Section

exports.updateSection = async (req, res) => {
  try {
    // data input
    const { sectionName, sectionId, courseId } = req.body;

    // data validation
    if (!sectionName || !sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All Fields are requires",
      });
    }

    // update data by DB call
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "Section updated Successfully",
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update section. Please Try Again",
      error: error.message,
    });
  }
};

// delete Section
exports.deleteSection = async (req, res) => {
  try {
    // get id - assuming that we are sending ID in params
    const { sectionId, courseId } = req.body;

    // use findByIdAndDelete
    await Section.findByIdAndDelete(sectionId);

    // do we need to delete entry from course schema??
    // this will be checked while testing
    const courseUpdated = await Course.updateOne(
      { _id: courseId },
      { $pull: { courseContent: [sectionId] } }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Section Deleted Successfully",
      courseUpdated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to Delete section. Please Try Again",
      error: error.message,
    });
  }
};
