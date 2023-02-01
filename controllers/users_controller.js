const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/user");
const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports.signup = function (req, res) {
  if (req.isAuthenticated()) {
    // check if the user is already authenticated
    return res.redirect("/users/profile"); // redirect the user to the profile page if they're already logged in
  }

  // render the signup page with the title "Sign Up Page"
  res.render("signup", {
    title: "Sign Up Page",
  });
};

//redirects to the profile page.
module.exports.createUser = async function (req, res) {
  return res.redirect("/users/profile");
};

//enders the sign in page.
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    // check if the user is already authenticated
    return res.redirect("/users/profile"); // redirect the user to the profile page if they're already logged in
  }
  res.render("signIn", {
    title: "Sign In Page",
  });
};

//function logs in the user and redirects to the profile page.
module.exports.createSession = async function (req, res) {
  if (!req.session.flashMessageShown) {
    req.flash("success", "Logged In Successfully");
    req.session.flashMessageShown = true;
  }

  // req.flash("success", "Logged In Successfully");
  return res.redirect("/users/profile");
};

//function displays the profile page with the user's email and name.
module.exports.profile = async function (req, res) {
  return res.render("profile", {
    email: await req.user.email,
    name: await req.user.name,
  });
};

// function logs out the user and redirects to the sign in page.
module.exports.destroySession = async function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out Successfully");

    return res.redirect("/users/sign-in");
  });
};

//function renders the password reset page.
module.exports.getreset = async function (req, res) {
  return res.render("resetPassword");
};

// function changes the user's password after checking if the current password is correct.
module.exports.resetPassword = async function (req, res) {
  const currPass = req.body.currpass;
  const newPass = req.body.newpass;

  //finding user by ID
  const user = await User.findById(req.user.id);
  if (!user) {
    req.flash("error", "Something went wrong");
    return res.redirect("back");
  }
  // checking if password is correct
  const isPasswordCorrrect = await bcrypt.compare(currPass, user.password);

  if (!isPasswordCorrrect) {
    req.flash("error", "Current password is wrong!!");
    return res.redirect("back");
  }
  // Hash the password before saving the doctor to the database
  const hashedPassword = await bcrypt.hash(newPass, 10);

  user.password = hashedPassword;

  await user.save();

  //logging  out the user after reseting password
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Password Reset. Please Login Again!!");
    return res.redirect("/users/sign-in");
  });
};

//function renders the forgot password page.
module.exports.getforgot = function (req, res) {
  return res.render("forgot");
};

//function generates a new password, changes it for the user,
//and sends an email with the new password.
module.exports.forgotPass = async function (req, res) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "User not found!!");
      return res.redirect("back");
    }
    //If user found
    const password = crypto.randomBytes(10).toString("hex");

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    //send email with password
    //Using nodemailer service
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",

      secure: false,
      auth: {
        user: "durgesh.project.work@gmail.com",
        pass: process.env.gmailPass,
      },
    });
    // body of email
    let mailOptions = {
      from: "durgesh.project.work@gmail.com",
      to: email,
      subject: "New password",

      html: `<h3>Your new password is: </h3> <h1>${password}</h1>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).send({ message: "Server error" });
      } else {
        console.log("Email sent: " + info.response);
        //"success" message is added to the flash and
        // the user is redirected to the "/users/sign-in" page.
        req.flash("success", "New Password has been sent to your Mail");
        return res.redirect("/users/sign-in");
      }
    });
  } catch (error) {
    req.flash("error", "Something went wrong");
    return res.redirect("back");
  }
};
