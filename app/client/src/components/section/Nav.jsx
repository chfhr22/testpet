import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { IoPodiumOutline } from "react-icons/io5";
import statistics from '../../assets/img/statistics.png'

const Nav = () => {
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/info') {
            return location.pathname.startsWith(path);
        }
        return location.pathname === path;
    };

    return (
        <div id='navSection' className='sec'>
            <nav>
                <ul>
                    <li><Link to='/' className={isActive('/') ? 'active' : ''}>메인</Link></li>
                    <li><Link to='/community' className={isActive('/community') ? 'active' : ''}>커뮤니티</Link></li>
                    <li><Link to='/find' className={isActive('/find') ? 'active' : ''}>보호소</Link></li>
                    <li><Link to='/info' className={isActive('/info') ? 'active' : ''}>지식정보</Link></li>
                </ul>
            </nav>
            <div className="statistics">
                <div className="stat__title">
                    <IoPodiumOutline />
                    <h2>통계</h2>
                </div>
                <div className="stat__desc">2022년 6월 ~ 2023년 12월</div>
                <div className="stat__img">
                    <img src={statistics} alt="통계이미지" />
                </div>
            </div>
        </div>
    )
}

export default Nav