import React from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Info } from '../data/Info'

const InfoDetail = () => {
  const { num } = useParams();
  const item = Info.find(infoItem => infoItem.num === parseInt(num, 10));

  if (!item) {
    return <div>해당 정보를 찾을 수 없습니다.</div>;
  }

  // 이전 및 다음 아이템을 위한 로직
  const currentIndex = Info.findIndex(infoItem => infoItem.num === item.num);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < Info.length - 1;
  const prevNum = hasPrev ? Info[currentIndex - 1].num : null;
  const nextNum = hasNext ? Info[currentIndex + 1].num : null;

  return (
    <div id='InfoDetailPage' className='pages'>
      <div className='info__detail__page'>
        <h2 className='info__detail__title'>{item.title}</h2>
        <div className="info__detail__author">
          <div className="author">{item.author}</div>
          <div className="date">{item.date}</div>
        </div>
        <div className="info__detail__cont">
          {item.img && <div className="info__detail__img"><img src={item.img} alt={item.title} /></div>}
          <div className="info__detail__text">{item.desc}</div>
        </div>
      </div>
      <div className="info__detail__button">
        {prevNum && <Link to={`/info/detail/${prevNum}`} className='prev'>이전으로</Link>}
        <Link to="/info" className='list'>목록으로</Link>
        {nextNum && <Link to={`/info/detail/${nextNum}`} className='next'>다음으로</Link>}
      </div>
    </div>
  );
};

export default InfoDetail;