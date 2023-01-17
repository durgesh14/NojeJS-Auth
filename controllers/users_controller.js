const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/user");
const nodemailer = require("nodemailer");
module.exports.signup = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }

  // req.flash("success", "Registration is Successful");
  res.render("signup", {
    title: "Sign Up Page",
  });
};

module.exports.createUser = async function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Registration is Successful, Please Login!!");

    return res.redirect("/users/sign-in");
  });
  // return res.render("profile");
};

module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  res.render("signIn", {
    title: "Sign In Page",
  });
};

module.exports.createSession = async function (req, res) {
console.log("wdwdwdw"+  req.session.flashMessageShown);
  if (!req.session.flashMessageShown) {
    req.flash("success", "Logged In Successfully");
    req.session.flashMessageShown = true;
  }

  // req.flash("success", "Logged In Successfully");
  return res.redirect("/users/profile");
};

module.exports.profile = async function (req, res) {
 
  return res.render("profile",{
    email: req.user.email,
    name:req.user.name
  });
};

module.exports.destroySession = async function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out Successfully");

    return res.redirect("/users/sign-in");
  });
};
module.exports.getreset = async function (req, res) {
  return res.render("resetPassword");
};
module.exports.resetPassword = async function (req, res) {
  const currPass = req.body.currpass;
  const newPass = req.body.newpass;

  const user = await User.findById(req.user.id);
  if (!user) {
    req.flash("error", "Something went wrong");
    return res.redirect("back");
  }
  console.log("user.password  " + req.user.id);
  const isPasswordCorrrect = await bcrypt.compare(currPass, user.password);

  if (!isPasswordCorrrect) {
    req.flash("error", "Current password is wrong!!");
    return res.redirect("back");
  }
  // Hash the password before saving the doctor to the database
  const hashedPassword = await bcrypt.hash(newPass, 10);

  user.password = hashedPassword;

  await user.save();

  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Password Reset. Please Login Again!!");
    return res.redirect("/users/sign-in");
  });
};

module.exports.getforgot = function (req, res) {
  return res.render("forgot");
};

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

    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",

      secure: false,
      auth: {
        user: "durgesh.project.work@gmail.com",
        pass: "faenjkssckchambp",
      },
    });

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
        req.flash("success", "Password Reset. Please Login Again!!");
    return res.redirect("/users/sign-in");
        // res.send(
        //   '<p> Password reset successful </p> <a href="/users/sign-in">Click here to Login</a>'
        // );
      }
    });
  } catch (error) {
    req.flash("error", "Something went wrong");
    return res.redirect("back");
  }
};
