import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Image from '../../assets/img/PETPAR.png';
import axios from 'axios';


const Findid = () => {
    const [youId, setYouId] = useState("");
    const logo = <img src={Image} alt="로고" height={50}></img>;

    const FindHanlder = (e) => {
        e.preventDefault();

        let body = {
            youId: youId
        }

        axios
            .post("/api/user/find", body)
            .then((response) => {
                if (response.data.success) {
                    const result = response.data.userInfo.email;
                    alert(result);
                }
            })
            .catch((err) => {
                alert(err.response.data.message); // 에러 메시지 출력
            })
    }

    return (
        <div id='loginPage'>
            <div className="login_box">
                <h1 className="logo">
                    {logo}
                </h1>
                <form name='login' method='post'>
                    <legend className="blind">로그인 영역</legend>

                    <div className="input_style">
                        <p>이메일</p>
                        <label htmlFor="id" className='blind'>이메일</label>
                        <input
                            type='id'
                            id='id'
                            name='youId'
                            placeholder='ID'
                            autoComplete='off'
                            required
                            value={youId}
                            onChange={(e) => { setYouId(e.currentTarget.value) }}
                        ></input>
                    </div>

                    <button type='submit' onClick={(e) => { FindHanlder(e) }}>로그인</button>

                    <ul>
                        <li><Link to='/findpass'>비밀번호 찾기</Link></li>
                        <li><Link to='/join'>회원가입</Link></li>
                    </ul>
                </form>
            </div>
            <div className="login_bg"></div>
        </div>
    )
}

export default Findid