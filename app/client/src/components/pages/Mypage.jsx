import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import firebase from "../../firebase.js";

const Mypage = () => {
    const [currentImage, setCurrentImage] = useState("");
    const [youName, setYouName] = useState("");
    const [youEmail, setYouEmail] = useState("");
    const [youPass, setYouPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [newPassC, setNewPassC] = useState("");

    const user = useSelector((state) => state.user)
    const navigate = useNavigate();

    useEffect(() => {
        if (user.isLoading && !user.accessToken) {
            navigate("/login")
        } else {
            setCurrentImage(user.photoURL)
        }
    }, [user, navigate])

    const ImageUpload = (e) => {
        const formData = new FormData();
        formData.append("file", (e.target.files[0]));

        axios
            .post("/api/user/profile/img", formData)
            .then((response) => {
                console.log(response)
                setCurrentImage(response.data.filePath)
            });
    }

    const SaveProfile = async (e) => {
        e.preventDefault();

        try {
            await firebase.auth().currentUser.updateProfile({
                photoURL: currentImage
            })
        } catch (err) {
            return alert("프로필 저장 실패오류");
        }

        let body = {
            photoURL: currentImage,
            uid: user.uid,
        }

        console.log(body)
        axios
            .post("/api/user/profile/update", body)
            .then((response) => {
                if (response.data.success) {
                    alert("프로필이 저장되었습니다.")
                    window.location.reload();
                } else {
                    return alert("프로필 저장에 실패하였습니다.");
                }
            })
    }

    const DeleteProfile = (e) => {
        e.preventDefault();

        setCurrentImage("https://kr.object.ncloudstorage.com/petpar-rlan/user/profile.png");
    }

    const SubmitHandler = async (e) => {
        e.preventDefault();

        if (newPass !== newPassC) {
            return alert("비밀번호가 일치하지 않습니다.");
        }

        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            youPass
        )

        try {
            const currentUser = firebase.auth().currentUser;
            await currentUser.reauthenticateWithCredential(credential);

            await currentUser.updateProfile({
                displayName: youName,
            });

            await currentUser.updatePassword(newPass)
                .then(() => {
                    console.log("비밀번호가 변경됨");
                })
                .catch((err) => {
                    console.log(err);
                    alert("세션이 만료되었습니다. 다시 로그인해주세요");
                    firebase.auth().signOut();
                    return navigate("/")
                })


            // mongoDB
            let body = {
                displayName: youName,
                email: youEmail,
                uid: user.uid,
            }

            axios
                .post("/api/user/update", body)
                .then((response) => {
                    if (response.data.success) {
                        return alert("저장되었습니다.");
                    }
                })
        } catch (err) {
            console.log(err);
            return alert("현재 비밀번호를 입력해주세요.")
        }
    }

    return (
        <div className='mypage pages'>
            < form name='login' method='post' >
                <legend className="blind">회원 정보 수정 영역</legend>

                <div className="input_style imgupload">
                    <div className='img'>
                        <img src={currentImage} alt="이미지" />
                    </div>
                    <label htmlFor="imageUpload" className='blind'>이미지 업로드:</label>
                    <input type="file" id="imageUpload" className='imguploadclass' name="image" accept="image/*" onChange={(e) => ImageUpload(e)} />
                    <div className="btn_wrap">
                        <button type="submit" onClick={(e) => { SaveProfile(e) }}>업로드</button>
                        <button type="submit" onClick={(e) => { DeleteProfile(e) }}>사진삭제</button>
                    </div>
                </div>

                <div className="input_style">
                    <p>이름</p>
                    <label htmlFor="name" className='blind'>이름</label>
                    <input
                        type='text'
                        id='name'
                        name='youName'
                        placeholder='NAME'
                        autoComplete='off'
                        required
                        value={youName}
                        onChange={(e) => { setYouName(e.currentTarget.value) }}
                    ></input>
                </div>

                {/* <div className="input_style">
                    <p>이메일</p>
                    <label htmlFor="email" className='blind'>이메일</label>
                    <input
                        type='email'
                        id='email'
                        name='youEmail'
                        placeholder='E-mail'
                        autoComplete='off'
                        required
                        value={youEmail}
                        onChange={(e) => { setYouEmail(e.currentTarget.value) }}
                    ></input>
                </div> */}

                <div className="input_style">
                    <p>비밀번호</p>
                    <label htmlFor="password" className='blind'>비밀번호</label>
                    <input
                        type='password'
                        id='password'
                        name='youPass'
                        placeholder='PASSWORD'
                        autoComplete='off'
                        required
                        value={youPass}
                        onChange={(e) => { setYouPass(e.currentTarget.value) }}
                    ></input>
                </div>
                <div className="input_style">
                    <p>새 비밀번호</p>
                    <label htmlFor="passwordC" className='blind'>새 비밀번호</label>
                    <input
                        type='password'
                        id='passwordC'
                        name='youPassC'
                        placeholder='PASSWORD'
                        autoComplete='off'
                        required
                        value={newPass}
                        onChange={(e) => { setNewPass(e.currentTarget.value) }}
                    ></input>
                </div>

                <div className="input_style">
                    <p>새 비밀번호 확인</p>
                    <label htmlFor="passwordCConfirm" className='blind'>새 비밀번호 확인</label>
                    <input
                        type='password'
                        id='passwordCConfirm'
                        name='youPassCConfirm'
                        placeholder='PASSWORD'
                        autoComplete='off'
                        required
                        value={newPassC}
                        onChange={(e) => { setNewPassC(e.currentTarget.value) }}
                    ></input>
                </div>
                <button type='submit' className='input_style' onClick={(e) => { SubmitHandler(e) }}>정보 수정</button>
            </form >

        </div >
    )
}

export default Mypage