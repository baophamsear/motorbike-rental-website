import React from 'react';
import { FaUsers, FaTasks, FaCog, FaClipboardList, FaChartLine } from 'react-icons/fa';
import UsersIcon from '../assets/icons/square-user.svg';
 

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">MotorRenter</h2>
      <ul>
        <li>
          <img src={UsersIcon} alt="Users" className="icon" />
          <span>Users</span>
        </li>
        <li><FaTasks /> Tasks</li>
        <li><FaClipboardList /> Work Logs</li>
        <li><FaChartLine /> Performance</li>
        <li><FaCog /> Settings</li>
      </ul>
    </aside>
  );
}
