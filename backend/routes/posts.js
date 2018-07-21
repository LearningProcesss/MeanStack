const express = require('express');
const middleWareUser = require("../middleware/user-checker");
const middlewareFile = require("../middleware/fileMiddleware");
const postCntrl = require("../controllers/postController");
const router = express.Router();



router.get("", postCntrl.getAllPosts);

router.get("/:id", postCntrl.getPostById);

router.post("", middleWareUser, middlewareFile, postCntrl.createPost);

router.put('/:id', middleWareUser, middlewareFile, postCntrl.updatePostById);

router.delete("/:id", middleWareUser, postCntrl.deletePostById);

module.exports = router;