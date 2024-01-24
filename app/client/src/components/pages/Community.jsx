import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import PostList from '../post/PostList';
import axios from 'axios';

const Community = () => {
    const [postList, setPostList] = useState([]);
    const [youCate, setYouCate] = useState("");
    const [cateActive, setCateActive] = useState("전체");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchPost = (category) => {
        setCateActive(category);
        if (category === '전체') {
            setYouCate('');
        } else {
            setYouCate(category);
        }
    }

    const getPostList = () => {
        let body = {
            category: youCate,
            searchTerm: searchTerm,
        }

        axios.post("/api/post/list", body)
            .then((response) => {
                if (response.data.success) {
                    setPostList([...response.data.postList]);

                    // const initialLikesCount = {};
                    // response.data.postList.forEach(post => {
                    //     initialLikesCount[post.postNum] = post.likes || 0;
                    // });
                    // setLikesCount(initialLikesCount);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const SearchHandler = () => {
        getPostList();
    }


    return (
        <section id='comPage' className='pages'>
            <div className="com_wrap">
                <div className="searchBar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.currentTarget.value)}
                        onKeyDown={(e) => {
                            if (e.keyCode === 13) SearchHandler();
                        }}
                    />
                    <button className="search-button" onClick={() => { SearchHandler() }}>검색</button>
                </div>
                <div className='comHeader'>
                    <ul className='comNav'>
                        <li><Link href="/" onClick={() => { fetchPost('전체') }} className={cateActive === '전체' ? 'active' : ''}>전체</Link></li>
                        <li><Link href="/" onClick={() => { fetchPost('입양') }} className={cateActive === '입양' ? 'active' : ''}>입양</Link></li>
                        <li><Link href="/" onClick={() => { fetchPost('자유') }} className={cateActive === '자유' ? 'active' : ''}>자유</Link></li>
                        <li><Link href="/" onClick={() => { fetchPost('질문') }} className={cateActive === '질문' ? 'active' : ''}>질문</Link></li>
                    </ul>
                    <Link to='./write' className="writeBtn">글쓰기</Link>
                </div>

                <div className='contents_wrap_wrap'>
                    <PostList youCate={youCate} getPostList={getPostList} postList={postList} />
                </div>
            </div>
        </section>
    )
}

export default Community