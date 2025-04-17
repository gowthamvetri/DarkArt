import { Router } from "express";
import auth from "../middleware/auth.js";
import {AddSubCategoryController,getSubCategoryController} from "../controllers/subCategory.controller.js";
import { get } from "mongoose";

const subCategoryRouter = Router()

subCategoryRouter.post('/create',auth,AddSubCategoryController)

subCategoryRouter.post('/get',getSubCategoryController)


export default subCategoryRouter