import {Router} from "express"
import auth from "../middleware/auth.js"
import { AddSubCategoryController, deleteSubCategoryController, getSubCategoryController, updateSubCategoryController } from "../controllers/subCategory.controller.js"

const SubCategoryRouter = Router()


SubCategoryRouter.post("/create",auth,AddSubCategoryController)
SubCategoryRouter.post ("/get",getSubCategoryController)
SubCategoryRouter.put ("/update",updateSubCategoryController)
SubCategoryRouter.delete ("/delete",auth,deleteSubCategoryController)
export default SubCategoryRouter