import bcryptjs from 'bcryptjs';
import userModel from '../model/user.model.js';
import { errorHandler } from '../utils/error.js';
import Listing from '../model/listing.model.js';

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  // Ensure that req.user and req.params.id exist
  // console.log("inside function");
  console.log("req.user", req.user);
  if (!req.user || !req.params.id) {
    return next(errorHandler(400, 'Invalid request'));
  }
  
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }

  try {
    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json({ success: true, listings });
  } catch (error) {
    next(errorHandler(500, 'Server Error'));
  }
};


export const getUser = async (req, res, next) => {
  try {
    
    const user = await userModel.findById(req.params.id);
  
    if (!user) return next(errorHandler(404, 'User not found!'));
  
    const { password: pass, ...rest } = user._doc;
  
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};