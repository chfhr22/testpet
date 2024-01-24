import React from 'react';
import { useLocation } from 'react-router-dom';
import Chat from '../contents/Chat';
import RepleArea from '../reple/RepleArea';
import PostMap from '../post/PostMap';

const Footer = () => {
    const location = useLocation();

    const getContent = () => {
        if (location.pathname.startsWith("/detail")) {
            return (
                <div id='footerSection' className='sec'>
                    <RepleArea />;
                </div>
            );
        } else if (location.pathname === "/find") {
            return (
                <div id='findFooterSection' className='sec'>
                    <PostMap />
                </div>
            );
        } else {
            return (
                <div id='footerSection' className='sec'>
                    <Chat />
                </div>
            );
        }
    };

    return (
        <>
            {getContent()}
        </>
    );
}

export default Footer;
