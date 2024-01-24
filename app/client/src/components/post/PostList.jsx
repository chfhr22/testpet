import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Image from '../../assets/img/default_img.png';
import { IoBookmarkOutline, IoHeartOutline, IoShareSocialSharp } from "react-icons/io5";
import { useSelector } from 'react-redux'

const PostList = (props) => {
    const { youCate, postList, getPostList } = props;

    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [likes, setLikes] = useState({});
    const [likesCount, setLikesCount] = useState({});

    const handleLikeClick = (postNum) => {
        if (user.accessToken === "") {
            alert("로그인 후 이용 가능합니다.");
            return navigate("/login");
        }

        const updatedLikes = {
            ...likes,
            [postNum]: !likes[postNum]
        };
        setLikes(updatedLikes);

        axios.post('/api/post/like', { postNum, likeState: updatedLikes[postNum], uid: user.uid })
            .then((response) => {
                if (response.data.success) {
                    setLikesCount(prevCount => ({
                        ...prevCount,
                        [postNum]: response.data.likes
                    }));
                }
            })
            .catch((err) => {
                console.error('Error:', err);
            });
    };

    useEffect(() => {
        getPostList();
    }, [youCate]);

    const shareFunction = (postNum) => {
        if (navigator.clipboard) {
            navigator.clipboard
                .writeText(`http://192.168.0.7:3000/detail/${postNum}`)
                .then(() => alert("링크가 클립보드에 복사되었습니다."));
        } else {
            alert("실패");
        }
    }

    return (
        <div className='contents_wrap_wrap'>
            <div className='contents_wrap'>
                {postList.map((post, key) => {
                    return (
                        <div className='board_wrap' key={key}>
                            <Link to={`/detail/${post.postNum}`}>
                                <div className="img"><img src={post.image ? post.image : Image} alt="게시글이미지" /></div>
                            </Link>
                            <div className="board_bar">
                                <div className='right'>
                                    <div className="profile">
                                        <img src={post.author.photoURL} alt="프로필사진" />
                                    </div>
                                    <div className="author">{post.author.displayName}</div>
                                    <span>3일</span>
                                </div>
                                <div className='icon'>
                                    <IoHeartOutline
                                        size={20}
                                        onClick={() => handleLikeClick(post.postNum)}
                                        style={{ color: likes[post.postNum] ? 'red' : 'black', cursor: 'pointer' }}
                                    />
                                    <span>{likesCount[post.postNum] || 0}</span>
                                    <IoShareSocialSharp size={20} onClick={() => { shareFunction(post.postNum) }} />
                                    <IoBookmarkOutline size={20} />
                                </div>
                            </div>
                            <div className="cont_wrap">
                                <div className="contents">
                                    <h3>{post.title}</h3>
                                    <p>{post.content}</p>
                                </div>
                                <div className='category'>{post.category}</div>
                            </div>

                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PostList;
