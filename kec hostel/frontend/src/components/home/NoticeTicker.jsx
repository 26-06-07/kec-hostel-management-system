import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

export default function NoticeTicker({ onOpenInfoModal }) {
  const [notices, setNotices] = useState([
    'Weekend Outing requests must be submitted before Friday 5:00 PM',
    'Special Onam/Diwali mess feast announced',
    '24/7 Medical Emergency helpline extended across all blocks'
  ]);

  useEffect(() => {
    axiosClient.get('/notices')
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setNotices(res.data.map(n => n.title));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="notice-ticker">
      <div className="container ticker-container">
        <span className="ticker-label">
          <span className="ticker-dot"></span>
          FLASH NOTICE
        </span>
        <div className="ticker-content">
          <span>{notices.join(' • ')}</span>
        </div>
        <button
          className="ticker-action"
          onClick={() => onOpenInfoModal('general')}
        >
          View All &rarr;
        </button>
      </div>
    </div>
  );
}
