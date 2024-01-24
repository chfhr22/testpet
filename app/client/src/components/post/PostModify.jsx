import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios';

const PostModify = () => {
    const [postInfo, setPostInfo] = useState({});
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    let params = useParams();
    let navigate = useNavigate();

    // 글 정보 가져오기
    useEffect(() => {
        let body = {
            postNum: params.postNum
        }

        axios.post('/api/post/detail', body)
            .then((response) => {
                if (response.data.success) {
                    setPostInfo(response.data.post);
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }, [params.postNum])

    useEffect(() => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
    }, [postInfo]);

    // 글 수정하기
    const onSubmit = (e) => {
        e.preventDefault();

        if (title === '' || content === '') {
            return alert('모든 항목을 채워주세요!!');
        }

        let body = {
            title: title,
            content: content,
            postNum: params.postNum
        }

        axios
            .post('/api/post/modify', body)
            .then((response) => {
                if (response.data.success) {
                    alert('글 수정이 완료됐습니다.')
                    navigate('/community');
                } else {
                    alert('글 수정이 실패하였습니다');
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <div className="write__wrap">
            <div className='write__header'>
                <h3>수정하기</h3>
            </div>
            <form className='write__form'>
                <legend className='blind'>글쓰기 영역</legend>
                <div className="detail__content__img">
                </div>
                <label htmlFor='youName' className='required'>글 제목</label>
                <input
                    type='text'
                    id='youName'
                    placeholder='글 제목을 작성하세요!'
                    value={title || ''}
                    onChange={(e) => setTitle(e.currentTarget.value)}
                />
                <label htmlFor='youName' className='required'>글 내용</label>
                <textarea
                    type='text'
                    id='youName'
                    placeholder='글 내용을 작성하세요!'
                    value={content || ''}
                    onChange={(e) => setContent(e.currentTarget.value)}
                />
                <div className='detail__btn'>
                    <button
                        type='submit'
                        onClick={(e) => onSubmit(e)}
                        className='btn__style'
                    >수정하기</button>
                    <Link
                        to='/community'
                        className='btn__style'
                    >취소하기</Link>
                </div>
            </form >
        </div>
    )
}

export default PostModify