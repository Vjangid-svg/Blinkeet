import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";


export async function uploadImageController(request, response) {
  try {
const file = request.file
console.log(file)
const uploadImage = await uploadImageCloudinary(file)
 return response.json({
      message:"Uploadide image",
      error: false,
      data:uploadImage,
      success: true,
 })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}