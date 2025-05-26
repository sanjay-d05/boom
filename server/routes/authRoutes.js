const express = require('express') ;
const cors = require('cors') ;
const { test, registerUser, loginUser, uploadVideo, getFeeds, purchaseVideo, postComment, getComments } = require('../controllers/authControllers');

const router = express.Router() ;

router.use(
    cors({
        origin : process.env.CLIENT_URI ,
        credentials : true
    })
) ;

router.get('/' , test) ;
router.post('/register' , registerUser) ;
router.post('/login' , loginUser) ;
router.post('/upload' , uploadVideo) ;
router.get('/feeds' , getFeeds) ;
router.post('/purchase' , purchaseVideo) ;
router.post('/videos/:id/comments' , postComment) ;
router.get('/videos/:id/comments', getComments);

module.exports = router ;