import CategoryModel from "../models/category.mmodel.js";
import SubCategoryModel from "../models/subCategory.model.js";

// for post the category
export async function AddCategoryController(request, response) {
  try {
    const {name,image} = request.body
    if(!name || !image){
         return response.status(400).json({
      message: "Enter required fields",
      error: true,
      success: false,
    });
    }
    const addCategory = CategoryModel({
        name,image
    })
     const saveCategory = await addCategory.save()
     if(!saveCategory){
          return response.status(400).json({
      message: "Not created",
      error: true,
      success: false,
    });
     }

    return response.status(200).json({
      message: "Added Category",
      error: false,
      success: true,
       data:saveCategory,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.response?.data?.message || error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}

// fro get category
export async function getCategoryController(request, response) {
  try {
    const data = await CategoryModel.find().sort({createdAt:-1})
   
    return response.status(200).json({
      // message: "Added Category",
       data:data,
      error: false,
      success: true,
     
    });
  } catch (error) {
    return response.status(500).json({
      message: error.response?.data?.message || error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}

// for update categor
export async function updateCategoryController(request, response) {
  try {
    const {_id,name,image} = request.body;
    const update = await CategoryModel.findByIdAndUpdate({
      _id:_id
    },{
      name,image
    })
   
    return response.status(200).json({
      message: "Category Updated",
       data:update,
      error: false,
      success: true,
     
    });
  } catch (error) {
    return response.status(500).json({
      message: error.response?.data?.message || error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}

// for delete category
export async function deleteCategoryController(request, response) {
  try {
    const {_id} = request.body;
    const checkSubCategory = await SubCategoryModel.find({
      category:{
        "$in":[_id]
      }
    }).countDocuments()

        const checkProduct = await SubCategoryModel.find({
      category:{
        "$in":[_id]
      }
    }).countDocuments()
    
    if(checkSubCategory>0 || checkProduct>0){
      return response.status(400).json({
      message: "Category is Already used cannot deleted ",
      error: true,
      success: false,
    })
  }
    const deleteCategory = await CategoryModel.deleteOne({
      _id:_id
    })
   
    return response.status(200).json({
      message: "Category Deleted",
       data:deleteCategory,
      error: false,
      success: true,
     
    });
  } catch (error) {
    return response.status(500).json({
      message: error.response?.data?.message || error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}