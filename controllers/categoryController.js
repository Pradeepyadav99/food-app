const categoryModel = require("../models/categoryModel");
const Response = require("../helpers/responseTrait");

// CREATE CAT
const createCatController = async (req, res) => {
  try {
    const { title, imageUrl } = req.body;
    //valdn
    if (!title || !imageUrl) {
        return Response.validationError(res, "please provide category title or image");
    }
    const newCategory = new categoryModel({ title, imageUrl });
    await newCategory.save();
    return Response.created(res, "category created");
  } catch (error) {
    console.log(error);
    return Response.error(res, "Error In Create Cat API", error);
  }
};

// GET ALL CAT
const getAllCatController = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    if (!categories) {
        return Response.notFound(res, "No Categories found");
    }
    return Response.success(res, "User Fetched Successfully", {
            totalCat: categories.length,
            categories,
        });
  } catch (error) {
    console.log(error);
    return Response.error(res, "Erorr in get All Categpry API", error);
  }
};

// UPDATE CATE
const updateCatController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, imageUrl } = req.body;
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      { title, imageUrl },
      { new: true }
    );
    if (!updatedCategory) {
        return Response.notFound(res, "No Category Found");
    }

    return Response.successMsg(res, "Category Updated Successfully");
  } catch (error) {
    console.log(error);
    return Response.error(res, "error in update cat api", error);
  }
};

// DLEETE CAT
const deleteCatController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
        return Response.notFound(res, "Please provide Category ID");
    }
    const category = await categoryModel.findById(id);
    if (!category) {
        return Response.notFound(res, "No Category Found With this id");
    }
    await categoryModel.findByIdAndDelete(id);
    return Response.successMsg(res, "category Deleted succssfully");
  } catch (error) {
    console.log(error);
    return Response.error(res, "error in Dlete Cat APi", error);
  }
};

module.exports = {
  createCatController,
  getAllCatController,
  updateCatController,
  deleteCatController,
};
