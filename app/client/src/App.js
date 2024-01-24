import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import firebase from './firebase.js'
import { useDispatch } from 'react-redux'
import { loginUser, clearUser } from './reducer/userSlice.js'

import Header from './components/section/Header'
import Main from './components/section/Main'
import Login from './components/pages/Login'
import Sub from './components/section/Sub'
import Findemail from './components/pages/Findemail'
import Join from './components/pages/Join'
import Findpass from './components/pages/Findpass'

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      console.log("userInfo :", userInfo)
      if (userInfo !== null) {
        dispatch(loginUser(userInfo.multiFactor.user));
      } else {
        dispatch(clearUser())
      }
    })
  }, [dispatch]);


  return (
    <BrowserRouter>
      <Main>
        <Header />
        <Routes>
          <Route path='*' element={<Sub />} />
          <Route path='/login' element={<Login />} />
          <Route path='/findemail' element={<Findemail />} />
          <Route path='/findpass' element={<Findpass />} />
          <Route path='/Join' element={<Join />} />
        </Routes>
      </Main>
    </BrowserRouter>

  )
}

export default App