import UserModel from "../models/users.model.js";
import sendEmail from "../config/sendEmail.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import dotenv from "dotenv";
import { generatedAccessToken } from "../utils/generatedAccessToken.js";
import { generatedRefreshToken } from "../utils/generatedRefreshToken.js";
import uploadImageClodinary from "../utils/uploadimageCloudnary.js";
import generatedOtp from '../utils/generatedOtp.js'
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js'
import jwt from 'jsonwebtoken'
dotenv.config();

export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Provide email,name and password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.json({
        message: "Email already exist",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new UserModel(payload);
    const save = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONT_URL}/verify-email?code=${save._id}`;
    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verification E-mail from Darkart",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    return res.json({
      message: "User Created Successfully",
      error: false,
      success: true,
      save,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function verifyEmailController(req, res) {
  try {
    const code = req.body;

    const id = await UserModel.findOne({ _id: code });
    if (!id) {
      return res.status(400).json({
        message: "Not a valid user",
        error: true,
        success: false,
      });
    }

    const updateUser = await UserModel.updateOne(
      {
        _id: code,
      },
      {
        verify_email: true,
      }
    );

    return res.json({
      message: "Verified Successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({
            message: "Please provide the inputs required",
            error: true,
            success: false,
        })
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid mail ID",
        error: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return res.status(400).json({
        message: "Contact with Admin",
        error: true,
        success: false,
      });
    }

    const chkPassword = await bcryptjs.compare(password, user.password);

    if (!chkPassword) {
      return res.status(400).json({
        message: "Make sure your password is correct",
        error: true,
        success: false,
      });
    }

    const updateuser = await UserModel.findByIdAndUpdate(user?._id, {
      last_login_date: new Date()
      });

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id)

    const cookieOption = {
        httpOnly : true,
        secure : true,
        sameSite : "None"
    }

    res.cookie('accessToken',accessToken,cookieOption)
    res.cookie('refreshToken',refreshToken,cookieOption)

   return res.json({
        message:"User login Successfully",
        error : false,
        success : true,
        data : {
            accessToken,
            refreshToken
        }
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function logoutController(req,res) {
    try {
        
        const userId = req.userId

        const cookieOption = {
            http : true,
            secure : true,
            sameSite : "None"
        }

        res.clearCookie('accessToken',cookieOption)
        res.clearCookie('refreshToken',cookieOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userId,{refresh_token : ""})

        return res.json({
            message : "Logout Successfully",
            error:false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export async  function uploadAvatar(request,response){
  try {
      const userId = request.userId // auth middlware
      const image = request.file  // multer middleware

      const upload = await uploadImageClodinary(image)
      
      const updateUser = await UserModel.findByIdAndUpdate(userId,{
          avatar : upload.url
      })

      return response.json({
          message : "upload profile",
          success : true,
          error : false,
          data : {
              _id : userId,
              avatar : upload.url
          }
      })

  } catch (error) {
      return response.status(500).json({
          message : error.message || error,
          error : true,
          success : false
      })
  }
}

export async function updateUserDetails(request,response){
  try {
      const userId = request.userId //auth middleware
      const { name, email, mobile, password } = request.body 

      let hashPassword = ""

      if(password){
          const salt = await bcryptjs.genSalt(10)
          hashPassword = await bcryptjs.hash(password,salt)
      }

      const updateUser = await UserModel.updateOne({ _id : userId},{
          ...(name && { name : name }),
          ...(email && { email : email }),
          ...(mobile && { mobile : mobile }),
          ...(password && { password : hashPassword })
      })

      return response.json({
          message : "Updated successfully",
          error : false,
          success : true,
          data : updateUser
      })


  } catch (error) {
      return response.status(500).json({
          message : error.message || error,
          error : true,
          success : false
      })
  }
}

export async function forgotPasswordController(request,response) {
  try {
      const { email } = request.body 

      const user = await UserModel.findOne({ email })

      if(!user){
          return response.status(400).json({
              message : "Email not available",
              error : true,
              success : false
          })
      }

      const otp = generatedOtp()
      const expireTime = new Date() + 60 * 60 * 1000 // 1hr

      const update = await UserModel.findByIdAndUpdate(user._id,{
        forgot_password_otp : otp,
          forgot_password_expiry : new Date(expireTime).toISOString()
      })

      await sendEmail({
          sendTo : email,
          subject : "Forgot password from Casual Clothing Fashion",
          html : forgotPasswordTemplate({
              name : user.name,
              otp : otp
          })
      })

      return response.json({
          message : "check your email",
          error : false,
          success : true
      })

  } catch (error) {
      return response.status(500).json({
          message : error.message || error,
          error : true,
          success : false
      })
  }
}

export async function verifyForgotPasswordOtp(request,response){
  try {
      const { email , otp }  = request.body

      if(!email || !otp){
          return response.status(400).json({
              message : "Provide required field email, otp.",
              error : true,
              success : false
          })
      }

      const user = await UserModel.findOne({ email })

      if(!user){
          return response.status(400).json({
              message : "Email not available",
              error : true,
              success : false
          })
      }

      const currentTime = new Date().toISOString()

      if(user.forgot_password_expiry < currentTime  ){
          return response.status(400).json({
              message : "Otp is expired",
              error : true,
              success : false
          })
      }

      if(otp !== user.forgot_password_otp){
          return response.status(400).json({
              message : "Invalid otp",
              error : true,
              success : false
          })
      }

      //if otp is not expired
      //otp === user.forgot_password_otp

      const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
          forgot_password_otp : "",
          forgot_password_expiry : ""
      })
      
      return response.json({
          message : "Verify otp successfully",
          error : false,
          success : true
      })

  } catch (error) {
      return response.status(500).json({
          message : error.message || error,
          error : true,
          success : false
      })
  }
}

export async function resetpassword(request,response){
  try {
      const { email , newPassword, confirmPassword } = request.body 

      if(!email || !newPassword || !confirmPassword){
          return response.status(400).json({
              message : "provide required fields email, newPassword, confirmPassword"
          })
      }

      const user = await UserModel.findOne({ email })

      if(!user){
          return response.status(400).json({
              message : "Email is not available",
              error : true,
              success : false
          })
      }

      if(newPassword !== confirmPassword){
          return response.status(400).json({
              message : "newPassword and confirmPassword must be same.",
              error : true,
              success : false,
          })
      }

      const salt = await bcryptjs.genSalt(10)
      const hashPassword = await bcryptjs.hash(newPassword,salt)

      const update = await UserModel.findOneAndUpdate(user._id,{
          password : hashPassword
      })

      return response.json({
          message : "Password updated successfully.",
          error : false,
          success : true
      })

  } catch (error) {
      return response.status(500).json({
          message : error.message || error,
          error : true,
          success : false
      })
  }
}

export async function refreshToken(request,response){
  try {
      const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1]  /// [ Bearer token]

      if(!refreshToken){
          return response.status(401).json({
              message : "Invalid token",
              error  : true,
              success : false
          })
      }

      const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

      if(!verifyToken){
          return response.status(401).json({
              message : "token is expired",
              error : true,
              success : false
          })
      }

      const userId = verifyToken?._id

      const newAccessToken = await generatedAccessToken(userId)

      const cookiesOption = {
          httpOnly : true,
          secure : true,
          sameSite : "None"
      }

      response.cookie('accessToken',newAccessToken,cookiesOption)

      return response.json({
          message : "New Access token generated",
          error : false,
          success : true,
          data : {
              accessToken : newAccessToken
          }
      })


  } catch (error) {
      return response.status(500).json({
          message : error.message || error,
          error : true,
          success : false
      })
  }
}

export async function userDetails(request,response){
  try {
      const userId  = request.userId

      const user = await UserModel.findById(userId).select('-password -refresh_token')

      return response.json({
          message : 'user details',
          data : user,
          error : false,
          success : true
      })
  } catch (error) {
      return response.status(500).json({
          message : "Something is wrong",
          error : true,
          success : false
      })
  }
}

export async function googleSignInController(req, res) {
  try {
    const { name, email, photoURL, uid } = req.body;

    if (!name || !email || !uid) {
      return res.status(400).json({
        message: "Name, email, and uid are required",
        error: true,
        success: false,
      });
    }

    let user = await UserModel.findOne({ email });

    if (user) {
      const updateUser = await UserModel.findByIdAndUpdate(user._id, {
        last_login_date: new Date(),
        ...(photoURL && { avatar: photoURL }),
      });

      const accessToken = await generatedAccessToken(user._id);
      const refreshToken = await generatedRefreshToken(user._id);

      const cookieOption = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      };

      res.cookie("accessToken", accessToken, cookieOption);
      res.cookie("refreshToken", refreshToken, cookieOption);

      return res.json({
        message: "Login successful",
        error: false,
        success: true,
        data: {
          accessToken,
          refreshToken,
        },
      });
    } else {
      const newUser = new UserModel({
        name,
        email,
        password: uid,
        avatar: photoURL || "",
        verify_email: true,
        google_id: uid,
      });

      const savedUser = await newUser.save();

      const accessToken = await generatedAccessToken(savedUser._id);
      const refreshToken = await generatedRefreshToken(savedUser._id);

      const cookieOption = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      };

      res.cookie("accessToken", accessToken, cookieOption);
      res.cookie("refreshToken", refreshToken, cookieOption);

      return res.json({
        message: "Account created and logged in successfully",
        error: false,
        success: true,
        data: {
          accessToken,
          refreshToken,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

