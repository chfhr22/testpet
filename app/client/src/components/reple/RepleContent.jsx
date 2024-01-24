import axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from "react-redux";

import moment from "moment";
import "moment/locale/ko";

const RepleContent = (props) => {
    const [editFlag, setEditFlag] = useState(false);
    const [reple, setReple] = useState(props.reple.reple)

    const user = useSelector((state) => state.user);

    const SetTime = (a, b) => {
        if (a !== b) {
            return moment(b).format("YY.MM.D hh:mm") + "(수정됨)";
        } else {
            return moment(a).format("YY.MM.D hh:mm");
        }
    }

    const SubmitHandler = (e) => {
        e.preventDefault();
        let body = {
            uid: user.uid,
            reple: reple,
            postId: props.reple.postId,
            repleId: props.reple._id
        }

        axios.post("/api/reple/edit", body).then((response) => {
            if (response.data.success) {
                alert("댓글이 수정되었습니다.");
            } else {
                alert("댓글 수정 실패했습니다.")
            }
            return window.location.reload();
        })
    }

    const DeleteHandler = (e) => {
        e.preventDefault();
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            let body = {
                repleId: props.reple._id,
                postId: props.reple.postId
            }
            axios.post("/api/reple/delete", body).then((response) => {
                if (response.data.success) {
                    alert("댓글이 삭제되었습니다.");
                    window.location.reload();
                }
            })
                .catch((err) => {
                    console.log(err);
                    alert("댓글 삭제 실패함");
                })
        }
    }

    return (
        <>
            <div className="reple__box" key={props.idx}>
                <div className='reple__author'>
                    <span className="profile">
                        <img src={props.reple.author.photoURL} alt="프로필이미지" />
                    </span>
                    <span className='name'>{props.reple.author.displayName}</span>
                    <span className='time'>{SetTime(props.reple.createdAt, props.reple.updatedAt)}</span>
                </div>
                {editFlag ? (
                    <div className='reple__modify__box'>
                        <form>
                            <label htmlFor="live__chat" className='blind' />
                            <input
                                type="text"
                                id='live__chat'
                                name='live__chat'
                                placeholder="댓글을 수정해주세요."
                                value={reple}
                                onChange={(e) => setReple(e.currentTarget.value)}
                                className='input__style'
                            />
                            <div className="reple__edit__box">
                                <button type='submit' onClick={(e) => { SubmitHandler(e) }} className='edit'>수정</button>
                                / <button onClick={(e) => {
                                    e.preventDefault();
                                    setEditFlag(false);
                                }} className='cancel'>취소</button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <>
                        <div className='reple__cont'>
                            {props.reple.reple}
                        </div>
                        {props.reple.author.uid === user.uid && (
                            <div className='reple__edit'>
                                <p className="modify" onClick={() => {
                                    setEditFlag(true);
                                }}>수정</p>
                                <p className="delete" onClick={(e) => {
                                    DeleteHandler(e);
                                }}>삭제</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}

export default RepleContent