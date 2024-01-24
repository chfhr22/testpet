const express = require("express");
const router = express.Router();

const { User } = require("../model/User.js");
const { Counter } = require("../model/Counter.js");

const setUpload = require("../util/upload.js");

router.post("/join", (req, res) => {
    let temp = req.body;

    Counter.findOne({ name: "counter" })
        .then((result) => {
            temp.userNum = result.userNum;

            const userData = new User(temp);
            userData.save().then(() => {
                Counter.updateOne({ name: "counter" }, { $inc: { userNum: 1 } }).then(() => {
                    res.status(200).json({ success: true });
                })
            })
        })
        .catch((err) => {
            console.log(err);

            res.status(400).json({ success: false })
        })
})


router.post("/namecheck", (req, res) => {
    User.findOne({ displayName: req.body.displayName })
        .exec()
        .then((result) => {
            let check = true;
            if (result) {
                check = false;
            }
            res.status(200).json({ success: true, check })
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ success: false })
        })
})

router.post("/find", (req, res) => {
    let temp = req.body

    console.log(temp)

    User.findOne({ email: temp.youId })
        .exec()
        .then((result) => {
            if (result) {
                const userInfo = result;
                console.log(userInfo);
                res.status(200).json({ success: true, userInfo })
            } else {
                res.status(400).json({ success: false, message: "해당 이메일로 가입된 회원을 찾을 수 없습니다." })
            }
        })
        .catch((err) => {
            res.status(400).json({ success: false, message: "죄송합니다. 서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요." })
            console.log(err);
        })
})


router.post("/profile/img", setUpload("patpar.team/user"), (req, res, next) => {
    res.status(200).json({ success: true, filePath: res.req.file.location })
})

router.post("/profile/update", (req, res) => {
    let temp = {
        photoURL: req.body.photoURL,
    }

    console.log(req.body.uid)

    User.updateOne({ uid: req.body.uid }, { $set: temp })
        .exec()
        .then(() => {
            res.status(200).json({ success: true });
        })
        .catch((err) => {
            res.status(400).json({ success: false });
        })
})

router.post("/update", (req, res) => {
    let temp = req.body;
    let updateFields = {};

    if (temp.displayName) {
        updateFields.displayName = temp.displayName;
    }

    if (temp.email) {
        updateFields.email = temp.email;
    }

    User.updateMany({ uid: req.body.uid }, { $set: updateFields })
        .exec()
        .then((result) => {
            console.log(result)
            res.status(200).json({ success: true });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Update failed" });
        });
})

module.exports = router;