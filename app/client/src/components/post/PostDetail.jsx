import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';

import img from '../../assets/img/default_img.png';

const PostDetail = (props) => {
    let params = useParams();
    let navigate = useNavigate();

    const DeleteHandler = () => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            let body = {
                postNum: params.postNum,
            }
            axios
                .post('/api/post/delete', body)
                .then((resonpse) => {
                    if (resonpse.data.success) {
                        alert('게시글이 삭제되었습니다.')
                        navigate('/community')
                    }
                })
                .catch((err) => {
                    console.log(err);
                    alert('게시글 삭제가 실패했습니다.')
                })
        }
    }

    return (
        <div className='detail__wrap'>
            <div className='detail__title'>
                <h3>{props.postInfo.title}</h3>
            </div>
            <div className='detail__content'>
                <div className="detail__content__img">
                    {props.postInfo.image ? <img src={props.postInfo.image} alt={props.postInfo.title} /> : <img src={img} alt='' />}
                </div>
                <div className="detail__content__text">
                    {props.postInfo.content}
                </div>
            </div>
            <div className='detail__btn'>
                <Link to={`/modify/${props.postInfo.postNum}`}>
                    수정
                </Link>
                <button onClick={() => DeleteHandler()}>삭제</button>
                <Link to='/community'>목록</Link>
            </div>
        </div >
    )
}

export default PostDetail