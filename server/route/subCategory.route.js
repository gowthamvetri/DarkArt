import { Router } from "express";
import auth from "../middleware/auth.js";
import {AddSubCategoryController,getSubCategoryController,updateSubCategoryController} from "../controllers/subCategory.controller.js";
import { get } from "mongoose";

const subCategoryRouter = Router()

subCategoryRouter.post('/create',auth,AddSubCategoryController)

subCategoryRouter.post('/get',getSubCategoryController)
subCategoryRouter.put('/update',auth,updateSubCategoryController)

export default subCategoryRouter