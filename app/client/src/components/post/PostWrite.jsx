import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PostImage from './PostImage';

import { useSelector } from 'react-redux';

const PostWrite = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [category, setCategory] = useState("입양");

    const user = useSelector((state) => state.user);
    let navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();

        if (title === "" || content === "") {
            return alert("내용을 작성해주세요.");
        }

        let body = {
            category: category,
            title: title,
            content: content,
            image: image,
            uid: user.uid,
        }

        axios
            .post("/api/post/write", body)
            .then((response) => {
                if (response.data.success) {
                    alert("글 작성이 완료되었습니다.");
                    navigate('/community')
                } else {
                    alert("글 작성이 실패하였습니다.")
                }
            })
            .catch((err) => { console.log(err) })
    }

    return (
        <div className='write__wrap'>
            <div className="write__header">
                <h2>글 쓰기</h2>
            </div>
            <div className="category__selection">
                <label htmlFor="category">카테고리: </label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="입양">입양</option>
                    <option value="자유">자유</option>
                    <option value="질문">질문</option>
                </select>
            </div>
            <form className="write__form">
                <legend className='blind'>글쓰기 영역</legend>
                <div>
                    <label htmlFor="youName" className='required'>제목</label>
                    <input
                        type="text"
                        id='youName'
                        placeholder='제목을 작성하세요.'
                        value={title}
                        onChange={(e) => setTitle(e.currentTarget.value)}
                    />
                </div>
                <div>
                    <label htmlFor="youName" className='required'>내용</label>
                    <textarea
                        type="text"
                        id='youName'
                        placeholder='내용을 작성하세요.'
                        value={content}
                        onChange={(e) => setContent(e.currentTarget.value)}
                    />
                </div>

                <PostImage setImage={setImage} />

                <div className='detail__btn'>
                    <button
                        type='submit'
                        className='btn__style'
                        onClick={(e) => onSubmit(e)
                        }>작성하기
                    </button>
                    <Link className='btn__style' to='/community'>취소하기</Link>
                </div>
            </form>
        </div>
    )
}

export default PostWrite