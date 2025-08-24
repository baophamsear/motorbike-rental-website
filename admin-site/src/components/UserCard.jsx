import React from 'react';
import "../assets/css/usercard.css";

export default function UserCard({ user, isActive }) {
  return (
    <div className={`user-card ${isActive ? 'active' : ''}`}>
      <div className="user-header">
        <div className="left">
          <h3>{user.fullName}</h3>
          {/* <span className="edit-icon">✏️</span> */}
        </div>
        {user.suspended && <span className="status">Suspended</span>}
      </div>

      <img
            className="avatar-img"
            src={user.avatarUrl || '/avatar.png'}
            alt={user.name}
          />

      <div className="user-body">
        <div className="info">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {/* <img
            className="avatar-img"
            src={user.avatarUrl || '/avatar.png'}
            alt={user.name}
          /> */}
        </div>
      </div>
    </div>
  );
}
