const express = require("express");

const router = express.Router();

const usersController = require("../controllers/users_controller");

const path = require("path");

//maps the root route to a function signIn,
router.get("/", usersController.signIn);
// maps a sub-route to "/users" 
router.use("/users", require("./users"));

// Create a middleware function for handling incorrect routes
router.use((req, res, next) => {
  console.log(path.join(__dirname, "../views"));
  res
    .status(404)
    .sendFile("404.html", { root: path.join(__dirname, "../views") });
});
module.exports = router;
