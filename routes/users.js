const express = require("express");
const router = express.Router();
const passport = require("passport");

const usersController = require("../controllers/users_controller");
//GET request to "/sign-up".
router.get("/sign-up", usersController.signup);
// POST request to "/sign-up"
router.post(
  "/sign-up",
  //uses the passport.authenticate() method, which authenticates the user credentials using the "local-signup" strategy
  //and redirects to the "/users/sign-up" route if authentication fails.
  passport.authenticate("local-signup", { failureRedirect: "/users/sign-up" }),
  usersController.createUser
);

//GET request to "/sign-in"
router.get("/sign-in", usersController.signIn);
// POST request to "/sign-in"
router.post(
  "/sign-in",
  //route uses the passport.authenticate() method, which authenticates the user credentials using the "local-signin" strategy
  //and redirects to the "/users/sign-in" route if authentication fails.
  passport.authenticate("local-signin", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);
//GET request to "/profile"
//page access is only allowed when user is logged In
router.get("/profile", passport.checkAuthentication, usersController.profile);

// GET request to "/sign-out"
router.get("/sign-out", usersController.destroySession);

// /GET request to "/reset-pass"
router.get(
  "/reset-pass",
  passport.checkAuthentication,
  usersController.getreset
);

//POST request to "/reset-pass"
router.post("/reset-pass", usersController.resetPassword);

// GET request to "/auth/google"
//authenticates the user credentials using the "google" strategy
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//GET request to "/auth/google/callback"
//handling the response from Google after authentication
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
  usersController.createUser
);

// /GET request to "/forgot-password".
router.get("/forgot-password", usersController.getforgot);

//POST request to "/forgot-password".
router.post("/forgot-password", usersController.forgotPass);
module.exports = router;
