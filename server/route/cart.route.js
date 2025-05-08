import {Router} from "express";
import auth from "../middleware/auth.js";
import { addToCartItemController, getCartItemController } from "../controllers/cart.controller.js";
import { get } from "mongoose";

const cartRouter = Router();

cartRouter.post("/create",auth,addToCartItemController);
cartRouter.get("/get",auth,getCartItemController);


export default cartRouter;