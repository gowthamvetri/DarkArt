import CategoryModel from "../models/category.model.js";

export const AddCategoryController = async(request,response)=>{
    try{
const {name,image}= request.body
if(!name|| !image){
    return response.json({
        message:"All fields are required",
        error:true,
        success:false
    })
}
const addCategory = CategoryModel({
    name,       
    image
    })
    const saveCategory = await addCategory.save()
    if(!saveCategory)
    {
        return response.status(400).json({
            message:"Category not added",
            error:true,
            success:false
        })
    }
    return response.status(201).json({
        message:"Category added successfully",
        data:saveCategory,
        error:false,
        success:true
    })
}
    catch(error){
return response.status(500).json({
    message: message || error,
    error:true,
    success: false

});

    }
}