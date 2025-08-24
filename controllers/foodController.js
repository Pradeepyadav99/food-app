const foodModal = require("../models/foodModal");
const orderModel = require("../models/orderModel");
const Response = require("../helpers/responseTrait");
const categoryModel = require("../models/categoryModel");

// CREATE FOOD
const createFoodController = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      imageUrl,
      foodTags,
      catgeory,
      code,
      isAvailabe,
      resturnat,
      rating,
    } = req.body;

    if (!title || !description || !price || !resturnat) {
      return Response.validationError(res, "Please provide all required fields");
    }

    const newFood = new foodModal({
      title,
      description,
      price,
      imageUrl,
      foodTags,
      catgeory,
      code,
      isAvailabe,
      resturnat,
      rating,
    });

    await newFood.save();
    return Response.created(res, "New Food Item Created successfully");
  } catch (error) {
    console.log(error);
    return Response.error(res, "Error in Create Food API", error);
  }
};

// GET ALL FOODS
const getAllFoodsController = async (req, res) => {
  try {
    const foods = await foodModal.find({});
    if (!foods || foods.length === 0) {
      return Response.notFound(res, "No food items found");
    }
    return Response.success(res, "Foods fetched successfully", {
      totalFoods: foods.length,
      foods,
    });
  } catch (error) {
    console.log(error);
    return Response.error(res, "Error in Get All Foods API", error);
  }
};

// GET SINGLE FOOD
const getSingleFoodController = async (req, res) => {
  try {
    const foodId = req.query.id;
    if (!foodId) {
      return Response.validationError(res, "Please provide food ID");
    }

    const food = await foodModal.findById(foodId);
    if (!food) {
      return Response.notFound(res, "No food found with this ID");
    }

    return Response.success(res, "Food fetched successfully", food);
  } catch (error) {
    console.log(error);
    return Response.error(res, "Error in Get Single Food API", error);
  }
};

// GET FOOD BY RESTURANT
const getFoodByResturantController = async (req, res) => {
  try {
    const resturantId = req.params.id;
    if (!resturantId) {
      return Response.validationError(res, "Please provide restaurant ID");
    }

    const foods = await foodModal.find({ resturnat: resturantId });
    if (!foods || foods.length === 0) {
      return Response.notFound(res, "No food found for this restaurant");
    }

    return Response.success(res, "Foods fetched by restaurant", foods);
  } catch (error) {
    console.log(error);
    return Response.error(res, "Error in Get Food By Restaurant API", error);
  }
};

// UPDATE FOOD
const updateFoodController = async (req, res) => {
  try {
    const foodId = req.params.id;
    if (!foodId) {
      return Response.validationError(res, "Please provide food ID");
    }

    const food = await foodModal.findById(foodId);
    if (!food) {
      return Response.notFound(res, "Food not found");
    }

    const updatedFood = await foodModal.findByIdAndUpdate(foodId, req.body, {
      new: true,
    });

    return Response.success(res, "Food item updated successfully", updatedFood);
  } catch (error) {
    console.log(error);
    return Response.error(res, "Error in Update Food API", error);
  }
};

// DELETE FOOD
const deleteFoodController = async (req, res) => {
  try {
    const foodId = req.params.id;
    if (!foodId) {
      return Response.validationError(res, "Please provide food ID");
    }

    const food = await foodModal.findById(foodId);
    if (!food) {
      return Response.notFound(res, "Food not found");
    }

    await foodModal.findByIdAndDelete(foodId);
    return Response.successMsg(res, "Food item deleted successfully");
  } catch (error) {
    console.log(error);
    return Response.error(res, "Error in Delete Food API", error);
  }
};

// PLACE ORDER
const placeOrderController = async (req, res) => {
  try {
    const { cart } = req.body;
    if (!cart || cart.length === 0) {
      return Response.validationError(res, "Please provide food cart");
    }

    let total = 0;
    cart.forEach((i) => {
      total += i.price;
    });

    const newOrder = new orderModel({
      foods: cart,
      payment: total,
      buyer: req.user.id,
    });

    await newOrder.save();
    return Response.created(res, "Order placed successfully");
  } catch (error) {
    console.log(error);
    return Response.error(res, "Error in Place Order API", error);
  }
};

// CHANGE ORDER STATUS
const orderStatusController = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return Response.validationError(res, "Please provide order ID");
    }

    const { status } = req.body;
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return Response.notFound(res, "Order not found");
    }

    return Response.success(res, "Order status updated successfully", order);
  } catch (error) {
    console.log(error);
    return Response.error(res, "Error in Update Order Status API", error);
  }
};

// GET ORDER

const getOrderController = async (req,res) => {
    try{
        const orderId = req.query.id;
        const filter = orderId ? { _id: orderId } : {};
        const orders = await orderModel.find(filter).populate({
        path: "foods",   
        populate: {
          path: "resturnat",
          model: "Resturant"
        }
      });
        if(!orders || orders.length === 0)
        {
            return Response.notFound(res, "No order items found");
        }
        return Response.success(res, "Orders fetched successfully", {
        totalOrders: orders.length,
        orders,
        });
    }catch(error){
        console.log(error);
        return Response.error(res, "Error in Get orders API", error);
    }
}

module.exports = {
  createFoodController,
  getAllFoodsController,
  getSingleFoodController,
  getFoodByResturantController,
  updateFoodController,
  deleteFoodController,
  placeOrderController,
  orderStatusController,
  getOrderController,
};
