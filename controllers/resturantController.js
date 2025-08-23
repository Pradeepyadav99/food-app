const resturantModel = require("../models/resturantModel");
const Response = require("../helpers/responseTrait");

// CREATE RESTURANT
const createResturantController = async (req, res) => {
  try {
    const {
      title,
      imageUrl,
      foods,
      time,
      pickup,
      delivery,
      isOpen,
      logoUrl,
      rating,
      ratingCount,
      code,
      coords,
    } = req.body;
    // validation
    if (!title || !coords) {
        return Response.validationError(res, "please provide title and address");
    }
    const newResturant = new resturantModel({
      title,
      imageUrl,
      foods,
      time,
      pickup,
      delivery,
      isOpen,
      logoUrl,
      rating,
      ratingCount,
      code,
      coords,
    });

    await newResturant.save();
    return Response.created(res, "New Resturant Created successfully");
  } catch (error) {
    console.log(error);
    return Response.error(res, "Error In Create Resturant api", error);
  }
};

// GET ALL RESTURNAT
const getAllResturantController = async (req, res) => {
  try {
    const resturants = await resturantModel.find({});
    if (!resturants) {
      return Response.notFound(res, "No Resturant Availible");
    }
    return Response.success(res, "User Fetched Successfully", {
        totalCount: resturants.length,
        resturants,
    });
  } catch (error) {
    console.log(error);
    return Response.error(res, "Error In Get ALL Resturat API", error);
  }
};

// GET RESTURNAT BY ID
const getResturantByIdController = async (req, res) => {
  try {
    const resturantId = req.query.id;
    if (!resturantId) {
        return Response.notFound(res, "Please Provide Resturnat ID");
    }
    //find resturant
    const resturant = await resturantModel.findById(resturantId);
    if (!resturant) {
        return Response.notFound(res, "no resturant found");
    }

    return Response.success(res, "Resturant Fetched Successfully", resturant);
  } catch (error) {
    console.log(error);
    return Response.error(res, "Error In Get Resturarnt by id api", error);
  }
};

//DELETE RESTRURNAT
const deleteResturantController = async (req, res) => {
  try {
    const resturantId = req.query.id;
    if (!resturantId) {
        return Response.notFound(res, "No Resturant Found OR Provide Resturant ID");
    }
    await resturantModel.findByIdAndDelete(resturantId);
    return Response.successMsg(res, "Resturant Deleted Successfully");
  } catch (error) {
    console.log(error);
    return Response.error(res, "Eror in delete resturant api", error);
  }
};

module.exports = {
  createResturantController,
  getAllResturantController,
  getResturantByIdController,
  deleteResturantController,
};
