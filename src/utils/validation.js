const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName) {
    throw new Error("firstName is Required!...");
  } else if (!lastName) {
    throw new Error("lastName is required...");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please Enter the valid EmailId...");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter a strong password...");
  }
};

const validateEditProfileData = (req) => {
  const allowedUpdates = [
    "firstName",
    "lastName",
    "about",
    "skills",
    "age",
    "gender",
    "photourl",
  ];

  const isUpdateAllowed = Object.keys(req.body).every((k) =>
    allowedUpdates.includes(k)
  );
  return isUpdateAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
