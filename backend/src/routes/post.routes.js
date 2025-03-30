import express from 'express';
import { protectRoute } from '../middleware/protectRout.js';
import { createPost, deletePost } from '../controller/post.controller.js';
const router = express.Router();

router.post('/create',protectRoute,createPost )
// router.post('/like/:id',protectRoute,likeUnlikePost)
// router.post('/commet/:id',protectRoute,commentOnPost )
router.delete('/:id',protectRoute,deletePost )

export default router