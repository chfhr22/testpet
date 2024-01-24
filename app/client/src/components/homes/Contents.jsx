import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom'
import heartFilled from '../../assets/img/다운로드.png';

import heart from '../../assets/img/heart.png';
import profile from '../../assets/img/profile.png';
import { IoBookmarkOutline, IoHeartOutline, IoShareSocialSharp, IoCallOutline } from "react-icons/io5";
import DogLoader from '../contents/DogLoader';



const Contents = () => {
    const [petItems, setPetItems] = useState([]);
    const [expandedItems, setExpandedItems] = useState({});
    const [activeCategory, setActiveCategory] = useState('all');
    const [likes, setLikes] = useState({});
    const [liked, setLiked] = useState({});
    const [loading, setLoading] = useState(true);



    const handleLikeClick = (key) => {
        setLiked(prevLiked => {
            const isCurrentlyLiked = !prevLiked[key];

            setLikes(prevLikes => {
                const currentLikes = prevLikes[key] || 0;
                return {
                    ...prevLikes,
                    [key]: isCurrentlyLiked ? currentLikes + 1 : Math.max(currentLikes - 1, 0),
                };
            });

            return {
                ...prevLiked,
                [key]: isCurrentlyLiked,
            };
        });
    };


    const shareOnKakao = (item) => {
        if (window.Kakao) {
            const kakao = window.Kakao;

            kakao.Link.sendDefault({
                objectType: 'feed',
                content: {
                    title: item.careNm,
                    description: item.specialMark,
                    imageUrl: item.popfile,
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href
                    }
                },
            });
        }
    };


    const toggleExpand = (index) => {
        setExpandedItems((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    }

    const fetchInfo = async (category) => {
        setLoading(true);
        let url = 'https://apis.data.go.kr/1543061/abandonmentPublicSrvc/abandonmentPublic';
        const apiKey = process.env.REACT_APP_PET_API_KEY;

        setActiveCategory(category);

        switch (category) {
            case 'all':
                url = 'https://apis.data.go.kr/1543061/abandonmentPublicSrvc/abandonmentPublic';
                break;
            case 'dog':
                url = 'https://apis.data.go.kr/1543061/abandonmentPublicSrvc/abandonmentPublic?upkind=417000';
                break;
            case 'cat':
                url = 'https://apis.data.go.kr/1543061/abandonmentPublicSrvc/abandonmentPublic?upkind=422400';
                break;
            default:
                break;
        }

        try {
            const res = await axios.get(url, {
                params: {
                    serviceKey: apiKey,
                    bgnde: "20230101",
                    endde: "20230116",
                    pageNo: "1",
                    numOfRows: "20",
                    _type: "json",
                }
            })
            console.log(res)

            let items = res.data.response.body.items.item;

            setPetItems(items);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (dateStr) => {
        if (dateStr.length === 8) {
            return `${dateStr.substring(2, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6)}`;
        }
        return dateStr;
    };

    useEffect(() => {
        fetchInfo('all');
    }, [])





    return (
        <>
            <div className='filter__wrap'>
                <ul>
                    <li><Link to="/" onClick={() => fetchInfo('all')} className={activeCategory === 'all' ? 'active' : ''}>전체</Link></li>
                    <li><Link to="/">팔로우</Link></li>
                    <li><Link to="/" onClick={() => fetchInfo('dog')} className={activeCategory === 'dog' ? 'active' : ''}>강아지</Link></li>
                    <li><Link to="/" onClick={() => fetchInfo('cat')} className={activeCategory === 'cat' ? 'active' : ''}>고양이</Link></li>
                </ul>
            </div>

            <div className='contents__wrap'>
                {loading ? (
                    <div className="load">
                        <DogLoader />
                    </div>
                ) : (
                    <>
                        {
                            petItems.map((item, key) => (
                                <div className="contents" key={key}>
                                    <div className="contents__top">
                                        <div className="shelter">{item.careNm}</div>
                                        <div className="total__like">
                                            <img
                                                src={liked[key] ? heartFilled : heart}
                                                alt="하트이미지"
                                            />
                                            <p>{likes[key] || 0}</p>
                                        </div>
                                        <div className="image">
                                            <img src={item.popfile} alt="게시글이미지" />
                                        </div>
                                    </div>
                                    <div className="contents__bottom">
                                        <div className="info">
                                            <div className="left">
                                                <div className="profile">
                                                    <img src={profile} alt="프로필이미지" />
                                                </div>
                                                <div className="name">{item.chargeNm}</div>
                                                <div className="date">{formatDate(item.noticeSdt)}</div>
                                                <div className="call"><IoCallOutline /></div>
                                            </div>
                                            <div className="right">
                                                <div className={`like ${liked[key] ? 'liked-heart' : ''}`} onClick={() => handleLikeClick(key)}>
                                                    <IoHeartOutline />
                                                </div>

                                                <div className="share" onClick={() => shareOnKakao(item)}>
                                                    <IoShareSocialSharp />
                                                </div>
                                                <div className="bookmark"><IoBookmarkOutline /></div>
                                            </div>
                                        </div>
                                        <div className="board">
                                            <div className="title">{item.specialMark}</div>
                                            <div className={expandedItems[key] ? `all` : `content`}>
                                                품종 : {item.kindCd}<br />
                                                나이 : {item.age}<br />
                                                색깔 : {item.colorCd}<br />
                                                몸무게 : {item.weight}<br />
                                                상태 : {item.processState}<br />
                                                특징 : {item.specialMark}
                                            </div>
                                            <div className='more' onClick={() => toggleExpand(key)}>
                                                {expandedItems[key] ? '접기' : '더보기'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </>
                )}
            </div>
        </>
    )
}

export default Contents
