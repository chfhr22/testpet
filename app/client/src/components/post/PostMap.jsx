import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useSelector } from 'react-redux';

const PostMap = () => {
    const address = useSelector((state) => state.address.detailAddress);
    const [position, setPosition] = useState({ lat: 37.5566803113882, lng: 126.904501286522 });

    useEffect(() => {
        // 비동기 함수 선언
        const fetchGeocodeData = async () => {
            try {
                const response = await axios.get('/api/geocode/address', {
                    params: { address } // 쿼리 파라미터로 address 전달
                });
                if (response.data.status === 'OK') {
                    const { x, y } = response.data.addresses[0];
                    setPosition({ lat: parseFloat(y), lng: parseFloat(x) });
                }
            } catch (err) {
                console.error(err);
            }
        };

        if (address) {
            fetchGeocodeData(); // 비동기 함수 호출
        }
    }, [address]);

    return (
        <>
            <Map center={position} style={{ width: '100%', height: '100%' }} level={3}>
                <MapMarker position={position} />
            </Map>
        </>
    );
};

export default PostMap;
