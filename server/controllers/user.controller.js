import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generateAccessToken.js";
import generatedRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generateOtp from "../utils/generateOtp.js";
import forgotPasswordTemplate from "../utils/forgotPassword.Template.js";
import jwt from "jsonwebtoken";

// user  registeration
export async function registerUserController(request, response) {
  try {
    const { name, email, password } = request.body;
    if (!name || !email || !password) {
      return response.status(400).json({
        message: "Provide all the mandatory fileds email,name annd password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (user) {
      return response.json({
        message: "Already registered email",
        error: true,
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new UserModel(payload);
    const save = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`;

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify email from binkeyit",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    return response.json({
      message: "User register successfully",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// verification of email
export async function verifyEmailController(request, response) {
  try {
    const { code } = request.body;

    const user = await UserModel.findOne({ _id: code });

    if (!user) {
      return response.status(400).json({
        message: "Invalid code",
        error: true,
        success: false,
      });
    }
    const updateUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );
    return response.status(200).json({
      message: "Verification Successfull",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// user login  controller
export async function loginController(request, response) {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({
        message: "Provide all the mandatory fileds email and password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return response.status(400).json({
        message: "User not registered",
        error: true,
        success: false,
      });
    }
    if (user.status !== "Active") {
      return response.status(400).json({
        message: "Contact to admin",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return response.status(400).json({
        message: "Check Your password",
        error: true,
        success: false,
      });
    }



    const accesstoken = await generatedAccessToken(user._id);
    const refreshtoken = await generatedRefreshToken(user._id);

    const updateUser = await UserModel.findByIdAndUpdate(user._id,{
      last_login_date:new Date()
    })
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    response.cookie("accesstoken", accesstoken, cookiesOption);
    response.cookie("refreshtoken", refreshtoken, cookiesOption);

    return response.json({
      message: "Login Successfully",
      error: false,
      success: true,
      data: {
        accesstoken,
        refreshtoken,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// user logout controlle
export async function logoutController(request, response) {
  try {
    const userid = request.userId; ///from middleware

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    response.clearCookie("accesstoken", cookiesOption);
    response.clearCookie("refreshtoken", cookiesOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
      refresh_token: " ",
    });

    return response.json({
      message: "Logout Successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// upload user  avtar
export async function uploadAvatar(request, response) {
  try {
    const userId = request.userId; //auth middleware

    const image = request.file; //multer middlerware
    const upload = await uploadImageCloudinary(image);

    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      
      avatar: upload.url,
    });

    return response.json({
      message: " upload Profile",
        error: false,
      success: true,
      data: {
        _id: userId,
        avatar: upload.url,
      },
    });
    // console.log("image",image)
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// update user details

export async function updateUserDetails(request, response) {
  try {
    const userId = request.userId; //auth middlewaere
    const { name, email, password, mobile } = request.body;
    let hashPassword = "";
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
    }
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hashPassword }),
      },
      { new: true } // 🔥 returns updated document
    );
    return response.status(200).json({
      message: "Updated Credentialls Successfuly",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// forgot password not login

export async function forgotPasswordControllerr(request, response) {
  try {
    const { email } = request.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "Email is not availale",
        error: true,
        success: false,
      });
    }

    const otp = generateOtp();
    const expireTime = new Date() + 60 * 60 * 1000; //1hr

    const update = await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: new Date(expireTime).toISOString(),
    });

    await sendEmail({
      sendTo: email,
      subject: "Forgot password from binkeyit",
      html: forgotPasswordTemplate({
        name: user.name,
        otp: otp,
      }),
    });
    return response.status(200).json({
      message: "Check your email",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// verify forgot password  otp

export async function verifyForgotPasswordOtp(request, response) {
  try {
    const { email, otp } = request.body;

    if (!email || !otp) {
      return response.status(400).json({
        message: "Provide required field such as email and otp",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "Email is not availale",
        error: true,
        success: false,
      });
    }

    const currentTime = new Date().toISOString;
    if (user.forgot_password_expiry < currentTime) {
      return response.status(400).json({
        message: "OTP is expired",
        error: true,
        success: false,
      });
    }

    if (otp !== user.forgot_password_otp) {
      return response.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false,
      });
    }
    // if otp is not expire or valid otp then

const updateUser = await UserModel.findByIdAndUpdate(user?._id,{forgot_password_otp:"",
  forgot_password_expiry:""})

    return response.status(200).json({
      message: "Verification successfull",
      error: false,
      success: true,
    });

    return response.status(200).json({
      message: "Check your email",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// reset password

export async function resetPassword(request, response) {
  try {
    const { email, newPassword, confirmPassword } = request.body;

    if (!email || !newPassword || !confirmPassword) {
      return response.status(400).json({
        message:
          "Provide required field such as email,newPassword,confirmPassword",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "Email is not availale",
        error: true,
        success: false,
      });
    }
    if (newPassword !== confirmPassword) {
      return response.status(400).json({
        message: "newPassword and confirmPassword is not same",
        error: true,
        success: false,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    const update = await UserModel.findOneAndUpdate(user._id, {
      password: hashPassword,
    });

    return response.status(200).json({
      message: "Password Updation successfull",
      error: false,
      success: true,
    });

    return response.status(200).json({
      message: "Check your email",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// refresh token controller..

export async function refreshToken(request, response) {
  try {
    const refreshToken =
       request.cookies?.refreshToken ||
  request.headers?.authorization?.split(" ")[1]; ///"Bearer token"

    if (!refreshToken) {
      return response.status(401).json({
        message: "Invalid Token",
        error: true,
        success: false,
      });
    }

    // console.log("refreshtoken",refreshToken)
   let verifyToken;
try {
  verifyToken = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
} catch (err) {
  return response.status(403).json({
    message: "Token expired or invalid",
    error: true,
    success: false,
  });
}
    console.log("verifyToken ", verifyToken);
    const userId = verifyToken._id;

    const newAccessToken = await generatedAccessToken(userId);

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    response.cookie("accesstoken", newAccessToken, cookiesOption);

    return response.status(200).json({
      message: "New Access TOKEN GENERATED!!",
      error: false,
      success: true,
      data: { accesstoken: newAccessToken },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// get login user details

export async function userDetails(request, response) {
  try {
    const userId = request.userId
    const user = await UserModel.findById(userId).select("-password -refresh_token")
    return response.status(200).json({
      message: "user details",
      error: false,
      success: true,
      data:user,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}