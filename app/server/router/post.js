const express = require("express");
const router = express.Router();


// 스키마
const { Post } = require("../model/Post.js");
const { User } = require("../model/User.js");
const { Counter } = require("../model/Counter.js");

// 이미지 업로드
const setUpload = require("../util/upload.js");

// 글쓰기
router.post("/write", (req, res) => {
    let temp = {
        category: req.body.category,
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
    };

    Counter.findOne({ name: "counter" })
        .exec()
        .then((counter) => {
            temp.postNum = counter.postNum;

            User.findOne({ uid: req.body.uid })
                .exec()
                .then((userInfo) => {
                    temp.author = userInfo._id;

                    const postWrite = new Post(temp);
                    postWrite
                        .save()
                        .then(() => {
                            Counter.updateOne({ name: "counter" }, { $inc: { postNum: 1 } })
                                .then(() => {
                                    res.status(200).json({ success: true })
                                })
                        })
                })
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ success: false })
        })
})

// 이미지 업로드

router.post("/image/upload", setUpload("petpar/post"), (req, res, next) => {
    // console.log(res.req);
    res.status(200).json({ success: true, filePath: res.req.file.location })
})

// 글목록
router.post("/list", (req, res) => {
    const { category, searchTerm } = req.body;

    let query = {};

    if (category) {
        query = { category: category }
    } else {
        query = {};
    }

    Post
        .find({
            ...query,
            $or: [
                { title: { $regex: searchTerm } },
                { content: { $regex: searchTerm } }
            ]
        })
        .sort({ _id: -1 })
        .populate("author")
        .exec()
        .then((result) => {
            res.status(200).json({ success: true, postList: result })
        })
        .catch((err) => {
            console.log(err)
            res.status(400).json({ success: false });
        })
})


// 글 상세페이지
router.post("/detail", (req, res) => {
    Post
        .findOne({ postNum: req.body.postNum })
        .populate("author")
        .exec()
        .then((result) => {
            res.status(200).json({ success: true, post: result });
        })
        .catch((err) => {
            console.log(err)
            res.status(400).json({ success: false });
        })
})

// 글 수정하기
router.post("/modify", (req, res) => {
    let temp = {
        title: req.body.title,
        content: req.body.content
    }
    Post.updateOne({ postNum: Number(req.body.postNum) }, { $set: temp })
        .exec()
        .then(() => {
            res.status(200).json({ success: true });
        })
        .catch((err) => {
            console.log(err)
            res.status(400).json({ success: false });
        })
})

// 글 삭제하기
router.post("/delete", (req, res) => {
    Post
        .deleteOne({ postNum: Number(req.body.postNum) })
        .exec()
        .then(() => {
            res.status(200).json({ success: true })
        })
        .catch((err) => {
            console.log(err)
            res.status(400).json({ success: false })
        })
})


// 좋아요 수 

router.post("/like", (req, res) => {
    const { postNum, likeState } = req.body;

    Post.findOne({ postNum: postNum })
        .then(post => {
            if (!post) {
                return res.status(404).json({ success: false, message: "Post not found" });
            }

            const likesChange = likeState ? 1 : -1;

            Post.updateOne({ postNum: postNum }, { $inc: { likes: likesChange } })
                .then(() => {

                    let newLikes = post.likes + likesChange;
                    res.status(200).json({ success: true, likes: newLikes });
                })
                .catch(err => res.status(500).json({ success: false, message: "Error updating like", error: err }));
        })
        .catch(err => res.status(500).json({ success: false, message: "Error finding post", error: err }));
});






module.exports = router;