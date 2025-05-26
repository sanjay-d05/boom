const User = require('../models/user') ;
const Video = require('../models/video') ;
const {comparePassword , hashPassword} = require('../helpers/auth') ;
const jwt = require('jsonwebtoken') ;
const { default: video } = require('../models/video');

const test = (req , res) => {
    return res.json('Test is working')
}

const registerUser = async(req , res) => {
    try {
        
        const {username , userid , email , password} = req.body ;

        const exitingUser = await User.findOne({email}) ;
        const existingid = await User.findOne({userid}) ;

        if(!username){
            return res.json({
                error : 'Username is required'
            })
        }

        if(!userid){
            return res.json({
                error : 'User id is required and should be unique'
            })
        }

        if(!email){
            return res.json({
                error : 'Email is required'
            })
        }  

        if(exitingUser){
            return res.json({
                error : 'User already Exists'
            })
        }

        if(existingid){
            return res.json({
                error : 'Choose a different User ID'
            })
        }

        if(!password){
            return res.json({
                error : 'Password is required'
            })
        }

        if(password.length < 8){
            return res.json({
                error : 'Password must be 8 characters long'
            })
        }

        const hashedPassword = await hashPassword(password) ;

        const user = await User.create({
            username ,
            userid ,
            email , 
            password : hashedPassword
        }) ;

        return res.status(201).json(user) ;

    } catch (error) {
        console.log(error);
    }
}

const loginUser = async(req,res) => {
    try {
        const{email , password} = req.body ;

        const checkUser = await User.findOne({email}) ;

        if(!email){
            return res.json({
                error : 'Email is required'
            })
        } 

        if(!password){
            return res.json({
                error : 'Password is required'
            })
        }

        if(!checkUser){
            return res.json({
                error : 'User does not exist'
            })
        }

        const passwordMatch = await comparePassword(password , checkUser.password) ;
        if(!passwordMatch){
            return res.json({
                error : 'password does not match'
            })
        }
        if(passwordMatch){
            jwt.sign({
                id : checkUser._id ,
                email : checkUser.email ,
                username : checkUser.username ,
                userid : checkUser.userid ,
                wallet: checkUser.wallet ,
                purchaseVideo : checkUser.purchasedVideos
            } , process.env.JWT_SECRET , {} , (err , token) => {
                if(err){
                    return res.status(500).json({
                        success : false ,
                        message : 'Internal server error'
                    })
                }
                res.cookie('accessToken' , token , {
                    sameSite: 'strict', // Change to 'none' if cross-origin is needed
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 24 * 60 * 60 * 1000, // da1 y in milliseconds
                }).json(checkUser) ;
            })
        }

    } catch (error) {
        console.log(error);
    }
}

const uploadVideo = async (req, res) => {
  try {
    const { title, description, shortFormUrl, longFormUrl, longFormPricing, videoType, uploadedBy } = req.body;

    if (!title || !description || !videoType) {
      return res.status(400).json({ error: 'Title, description and video type are required' });
    }

    if (!uploadedBy) {
      return res.status(400).json({ error: 'Uploader information is required' });
    }

    let videoData = {
      title,
      description,
      videoType,
      uploadedBy,
    };

    if (videoType === 'short-form') {
      if (!shortFormUrl) {
        return res.status(400).json({ error: 'Short-form video URL is required' });
      }
      videoData.shortFormUrl = shortFormUrl;
    }

    if (videoType === 'long-form') {
      if (!longFormUrl) {
        return res.status(400).json({ error: 'Long-form video URL is required' });
      }

      videoData.longFormUrl = longFormUrl;
      videoData.longFormPricing = longFormPricing;
    }

    const newVideo = new Video(videoData);
    await newVideo.save();

    res.status(201).json({ message: 'Video saved successfully', video: newVideo });
  } catch (err) {
    console.error('Video upload error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


const getFeeds = async(req,res) => {
    try {
        const feeds = await Video.find() ;
        return res.status(201).json(feeds) ;
    } catch (error) {
        console.log(error);
    }
}

const purchaseVideo = async (req, res) => {
  try {
    const { userId, videoId } = req.body;

    if (!userId || !videoId) {
      return res.status(400).json({ message: 'User ID and Video ID are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const alreadyPurchased = user.purchasedVideos.some(
      (id) => id.toString() === videoId.toString()
    );
    if (alreadyPurchased) {
      return res.status(400).json({ message: 'Video already purchased' });
    }

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const price = video.longFormPricing || 0;
    if (user.wallet < price) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Deduct wallet and add video to purchasedVideos
    user.wallet -= price;
    user.purchasedVideos.push(videoId);
    await user.save();

    return res.status(200).json({
      message: 'Purchase successful',
      wallet: user.wallet,
      purchasedVideos: user.purchasedVideos,
    });
  } catch (err) {
    console.error('❌ Error in /purchase:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const postComment = async(req,res) => {
  const { username, text } = req.body;
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    video.comments.push({ username, text });
    await video.save();
    res.status(200).json(video.comments);
  } catch (error) {
    res.status(500).json({ message: 'Error posting comment' });
  }
} ;

const getComments = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Sort comments by createdAt descending (latest first)
    const sortedComments = video.comments
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(sortedComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
};



module.exports = {
    test ,
    registerUser ,
    loginUser ,
    uploadVideo ,
    getFeeds ,
    purchaseVideo ,
    postComment ,
    getComments
}