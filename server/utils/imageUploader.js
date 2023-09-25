const cloudinary = require('cloudinary').v2


exports.uploadImageToCloudinary  = async (file, folder, height, quality) => {
    const options = {folder};
    if(height) {
        options.height = height;
    }
    if(quality) {
        options.quality = quality;
    }
    options.resource_type = "auto";




    // const result = await cloudinary.uploader.upload( file.tempFilePath, options );
    const result = await cloudinary.uploader.upload(file.tempFilePath, options )

    return result;
}


// const cloudinary = require('cloudinary').v2;

// exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
//     try {
//         const options = { folder };
//         if (height) {
//             options.height = height;
//         }
//         if (quality) {
//             options.quality = quality;
//         }
//         options.resource_type = "auto";

//         console.log("Before Result");

//         const result = await cloudinary.uploader.upload(file.tempFilePath, options);

//         console.log("After Result");
//         return result;
//     } catch (error) {
//         console.error("Error uploading to Cloudinary:", error);
//         throw error; // Rethrow the error to be caught by the calling code
//     }
// };
