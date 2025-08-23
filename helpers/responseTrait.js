module.exports = {
  success: (res, message = "Success", data = {}, status = 200) => {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  },

  created: (res, message = "Created Successfully", status = 201) => {
    return res.status(status).json({
      success: true,
      message,
    });
  },

  validationError: (res, message = "Validation Error", errors = {}, status = 422) => {
    return res.status(status).json({
      success: false,
      message,
      errors,
    });
  },

  error: (res, message = "Something Went Wrong", error = {}, status = 500) => {
    return res.status(status).json({
      success: false,
      message,
      error,
    });
  },

  notFound: (res, message = "Resource Not Found", status = 404) => {
    return res.status(status).json({
      success: false,
      message,
    });
  },

  unauthorized: (res, message = "Unauthorized", status = 401) => {
    return res.status(status).json({
      success: false,
      message,
    });
  }
};
