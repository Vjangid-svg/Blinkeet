import Summaryapi from "../common/Summaryapi";
import Axios from "./Axios";

const uploadImage = async (image) => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await Axios({
      ...Summaryapi.uploadImage,
      data: formData,
    });
    return response
  } catch (error) {
    return error;
  }
};

export default uploadImage