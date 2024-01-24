const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        category: String,
        title: String,
        content: String,
        postNum: Number,
        image: String,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        likes: {
            type: Number,
            default: 0 // 좋아요 수의 초기값은 0
        }
    },
    { collection: "posts", timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };