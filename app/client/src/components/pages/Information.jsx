import React from 'react';
import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import {Info} from '../data/Info'

const Information = () => {
    const location = useLocation();
    const { category } = useParams();

    const isActive = (path) => {
        if (path === '/info') {
            return location.pathname === path;
        }
        return location.pathname.includes(path);
    };

    const filteredData = category ? Info.filter(item => item.pet === category) : Info;

    return (
        <div id='infoPage' className='pages'>
            <div className="info__wrap">
                <div className="filter__wrap">
                    <ul>
                        <li><NavLink to="/info" end className={({ isActive }) => isActive ? 'active' : ''}>전체보기</NavLink></li>
                        <li><NavLink to="/info/category/가이드" className={({ isActive }) => isActive ? 'active' : ''}>입양 가이드</NavLink></li>
                        <li><NavLink to="/info/category/질병" className={({ isActive }) => isActive ? 'active' : ''}>질병</NavLink></li>
                        <li><NavLink to="/info/category/강아지" className={({ isActive }) => isActive ? 'active' : ''}>강아지</NavLink></li>
                        <li><NavLink to="/info/category/고양이" className={({ isActive }) => isActive ? 'active' : ''}>고양이</NavLink></li>
                    </ul>
                </div>
                <div className="info">
                    {
                        filteredData.map((item, key) => (
                            <Link to={`/info/detail/${item.num}`} key={key} className='info__box'>
                                <div className="info__img"><img src={item.img} alt={item.title} /></div>
                                <div className='info__box__cont'>
                                    <div className="info__cate">
                                        {item.category}
                                    </div>
                                    <div className="info__title">
                                        {item.title}
                                    </div>
                                    <div className="info__cont">
                                        {item.desc}
                                    </div>
                                    <div className='info__author'>
                                        <div className="date">
                                            {item.date}
                                        </div>
                                        <div className="author">
                                            {item.author}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Information