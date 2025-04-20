import SubCategoryModel from "../models/subCategory.model.js";

export const AddSubCategoryController = async(request,response)=>{
    try {
        const { name, image, category } = request.body 
        

        if(!name && !image && !category[0] ){
            return response.status(400).json({
                message : "Provide name, image, category",
                error : true,
                success : false
            })
        }

        const payload = {
            name,
            image,
            categoryId:category
        }

        console.log(payload)


        const createSubCategory = SubCategoryModel(payload)
        const save = await createSubCategory.save()

        return response.json({
            message : "Sub Category Created",
            data : save,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getSubCategoryController = async(request,response)=>{
    try {
        const data = await SubCategoryModel.find().sort({createdAt : -1}).populate("categoryId")
        return response.json({
            message : "Sub Category data",
            data : data,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
 export const updateSubCategoryController = async(request,response)=>{
    try {
        // const { id } = request.params
        const { _id,name, image, category } = request.body 
        const checkSub = await SubCategoryModel.findById(_id)
        console.log(name,checkSub,category)
        if(!checkSub){
            return response.status(404).json({
                message : "Sub Category Not Found",
                error : true,
                success : false
            })
        }
        if(!name && !image && !category[0] ){
            return response.status(400).json({
                message : "Provide name, image, category",
                error : true,
                success : false
            })
        }

        const payload = {
            name,
            image,
            categoryId:category._id
        }

        // console.log(payload)


        const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id,{
            name,
            image,
            categoryId:category
        },{new : true}).populate("categoryId")
        //console.log(updateSubCategory)
        console.log("updateSubCategory",updateSubCategory)  

        return response.json({
            message : "Sub Category Updated",
            data : updateSubCategory,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}   


export const deleteSubCategoryController = async(request,response)=>{   
    try{
          const { _id } = request.body
          console.log("id",_id)
            const deleteSub = await SubCategoryModel.findByIdAndDelete(_id)
            return response.json({
                message : "Sub Category Deleted",
                data : deleteSub,
                error : false,
                success : true
            })
    }
    catch(error){
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

