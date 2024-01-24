import React, { useEffect, useState } from 'react'
import PostDetail from './PostDetail'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RepleArea from '../reple/RepleArea';
import PostModify from './PostModify';

const PostArea = () => {
    const [postInfo, setPostInfo] = useState({});
    const [flag, setFlag] = useState(false);

    let params = useParams();

    // 글 불러오기
    useEffect(() => {
        let body = {
            postNum: params.postNum
        }

        axios.post('/api/post/detail', body)
            .then((response) => {
                console.log("response : ", response);
                setPostInfo(response.data.post);
                setFlag(true);
            })
            .catch((err) => {
                console.log(err)
            })
    }, [params.postNum]);

    return (
        <>
            {flag ? (
                <div className='postarea__wrap'>
                    <PostDetail postInfo={postInfo} />
                </div>
            ) : (
                <div>
                    로딩중
                </div>
            )}
        </>
    )
}

export default PostArea