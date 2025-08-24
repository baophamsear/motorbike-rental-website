import React from 'react';
import "../assets/css/topbar.css";

export default function Topbar() {
  return (
    <div className="topbar">
      <input type="text" placeholder="Search for anything..." />
      <div className="profile">
        <span>Anima Agrawal</span>
        <img src="/avatar.png" alt="avatar" />
      </div>
    </div>
  );
}
