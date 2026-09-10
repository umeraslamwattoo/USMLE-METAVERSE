const User = require('../Models/UserModel');
const Payment = require('../Models/PaymentModel');
const bcrypt = require('bcrypt');
const fs = require('fs');
// Register User
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, phoneno } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phoneno
        });
        
        await user.save();
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneno: user.phoneno
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // Send only basic user information
        const userResponse = {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneno: user.phoneno,
          profileImage: user.profileImage,
          enableaccess: user.enableaccess
      };
        
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: userResponse
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Add this to your UserController
exports.changePassword = async (req, res) => {
    try {
      const { userId, currentPassword, newPassword } = req.body;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({
        success: true,
        message: 'Password updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  exports.updateUser = async (req, res) => {
    try {
      const { name, email, phoneno } = req.body;
      const userId = req.params.id;
      
      console.log("Received update request for user ID:", userId);
      
      if (!userId || userId === "undefined") {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID provided'
        });
      }
  
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use'
        });
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email, phoneno },
        { new: true, select: '-password' }
      );
  
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phoneno: updatedUser.phoneno,
          profileImage: updatedUser.profileImage, // Include the profile image
          enableaccess: updatedUser.enableaccess
        }
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
exports.toggleAccess = async (req, res) => {
  try {
    const userId = req.params.id;
    // Expect a boolean value in the request body for enableaccess
    const { enableaccess } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    user.enableaccess = enableaccess;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User access updated successfully',
      user: {
        id: user._id,
        enableaccess: user.enableaccess,
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
  
// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        // Delete all associated payments
        await Payment.deleteMany({ userId: req.params.id });
        
        res.status(200).json({ success: true, message: 'User and associated payments deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateProfileImage = async (req, res) => {
  try {
      const userId = req.params.id;
      
      if (!userId || userId === "undefined") {
          return res.status(400).json({
              success: false,
              message: 'Invalid user ID provided'
          });
      }

      // Check if file was uploaded
      if (!req.file) {
          return res.status(400).json({
              success: false,
              message: 'No image file provided'
          });
      }

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({
              success: false,
              message: 'User not found'
          });
      }

      // If user already has a profile image, delete the old one
      if (user.profileImage) {
          const oldImagePath = user.profileImage;
          const fullPath = `./${oldImagePath}`;
          
          // Check if file exists before attempting to delete
          if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
          }
      }

      // Update user with new profile image path
      user.profileImage = req.file.path;
      await user.save();

      res.status(200).json({
          success: true,
          message: 'Profile image updated successfully',
          user: {
              id: user._id,
              name: user.name,
              email: user.email,
              phoneno: user.phoneno,
              profileImage: user.profileImage,
              enableaccess: user.enableaccess
          }
      });
  } catch (error) {
      console.error("Profile image update error:", error);
      res.status(500).json({
          success: false,
          message: error.message
      });
  }
};

// Remove profile image
exports.removeProfileImage = async (req, res) => {
  try {
      const userId = req.params.id;
      
      if (!userId || userId === "undefined") {
          return res.status(400).json({
              success: false,
              message: 'Invalid user ID provided'
          });
      }

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({
              success: false,
              message: 'User not found'
          });
      }

      // If user has a profile image, delete it
      if (user.profileImage) {
          const imagePath = user.profileImage;
          const fullPath = `./${imagePath}`;
          
          // Check if file exists before attempting to delete
          if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
          }
          
          // Remove profile image reference from user
          user.profileImage = null;
          await user.save();
      }

      res.status(200).json({
          success: true,
          message: 'Profile image removed successfully',
          user: {
              id: user._id,
              name: user.name,
              email: user.email,
              phoneno: user.phoneno,
              profileImage: null,
              enableaccess: user.enableaccess
          }
      });
  } catch (error) {
      console.error("Profile image removal error:", error);
      res.status(500).json({
          success: false,
          message: error.message
      });
  }
};
