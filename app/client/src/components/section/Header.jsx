import React from 'react'
import logoimg from '../../assets/img/logoimg.png'

import firebase from '../../firebase.js'
import { useSelector } from 'react-redux';

import { IoNotifications } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    const LogoutHandler = () => {
        firebase.auth().signOut();
        navigate("/")
    }

    return (
        <div id='headerSection' className='sec'>
            <h1 className="header__logo">
                <Link to='/'>
                    <div className="logo__img">
                        <img src={logoimg} alt="로고이미지" />
                    </div>
                </Link>
            </h1>
            {user.accessToken ? (
                <div className="header__profile">
                    <div className="noti">
                        <IoNotifications />
                        <div className="new"></div>
                    </div>
                    <div className="profile">
                        <Link to='/mypage'>
                            <img src={user.photoURL} alt="프로필사진" />
                        </Link>
                    </div>
                    <Link onClick={(() => LogoutHandler())}>로그아웃</Link>
                </div>
            ) : (
                <Link to='/login'>로그인</Link>
            )}
        </div>
    )
}

export default Header