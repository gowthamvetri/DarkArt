import { Router } from "express";
import auth from "../middleware/auth.js";
import {AddSubCategoryController} from "../controllers/subCategory.controller.js";

const subCategoryRouter = Router()

subCategoryRouter.post('/create',auth,AddSubCategoryController)


export default subCategoryRouter