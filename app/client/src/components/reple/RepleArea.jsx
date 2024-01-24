import React, { useEffect, useState } from 'react'
import RepleWrite from './RepleWrite';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import RepleList from './RepleList';

const RepleArea = () => {
    const [postId, setPostId] = useState({});
    const [flag, setFlag] = useState(false);

    let location = useLocation();
    let postNum = location.pathname.slice(8)

    // 글 정보 불러오기
    useEffect(() => {
        let body = {
            postNum: postNum
        }

        axios.post('/api/post/detail', body)
            .then((response) => {
                console.log("response : ", response);
                setPostId(response.data.post._id);
                setFlag(true);
            })
            .catch((err) => {
                console.log(err)
            })
    }, [postNum]);
    return (
        <>
            {flag ? (
                <>
                    <h2>댓글</h2>
                    <div className='reple__wrap'>
                        <RepleList postId={postId} />
                    </div>
                    <RepleWrite postId={postId} />
                </>
            ) : (
                <>
                    <h2>댓글</h2>
                    <div className='reple__wrap'>
                        로딩중
                    </div>
                </>
            )}
        </>
    )
}
export default RepleArea