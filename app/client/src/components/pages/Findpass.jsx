import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Image from '../../assets/img/PETPAR.png';
import firebase from '../../firebase.js'

const Findpass = () => {
    const logo = <img src={Image} alt="로고" height={50}></img>;
    const [youName, setYouName] = useState("");
    const [youEmail, setYouEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await firebase.auth().sendPasswordResetEmail(youEmail);
            alert('비밀번호 재설정 링크를 이메일로 보냈습니다. 메일을 확인해 주세요.');
        } catch (error) {
            alert('비밀번호 재설정 이메일 전송에 실패했습니다.');
            console.error('비밀번호 재설정 오류:', error);
        }
    };

    return (
        <div id='loginPage'>
            <div className="login_box">
                <h1 className="logo">
                    {logo}
                </h1>
                <form name='login' method='post' onSubmit={(e) => { handleSubmit(e) }}>
                    <legend className="blind">로그인 영역</legend>

                    <div className="input_style">
                        <p>아이디</p>
                        <label htmlFor="id" className='blind'>아이디</label>
                        <input
                            type='text'
                            id='id'
                            name='youId'
                            placeholder='ID'
                            autoComplete='off'
                            required
                            value={youName}
                            onChange={(e) => { setYouName(e.currentTarget.value) }}
                        ></input>
                    </div>

                    <div className="input_style">
                        <p>이메일</p>
                        <label htmlFor="emaill" className='blind'>이메일</label>
                        <input
                            type='emaill'
                            id='emaill'
                            name='youEmail'
                            placeholder='E-mail'
                            autoComplete='off'
                            required
                            value={youEmail}
                            onChange={(e) => { setYouEmail(e.currentTarget.value) }}
                        ></input>
                    </div>

                    <button type='submit'>이메일 전송</button>
                    {/* onClick={(e) => { PassFindHandler(e) }} */}

                    <ul>
                        <li><Link to='/findemail'>이메일 찾기</Link></li>
                        <li><Link to='/join'>회원가입</Link></li>
                    </ul>
                </form>
            </div>
            <div className="login_bg"></div>
        </div>
    )
}

export default Findpass