import React from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import UserCard from '../../components/UserCard';
// import Sidebar from '../components/Sidebar';
// import Topbar from '../components/Topbar';
// import UserCard from '../components/UserCard';
import "../../assets/css/users.css";
import APIs, { authApis, endpoints } from '../../context/APIs';
import { getAuthApi } from '../../config/authUtils';

export default function Users() {

  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    console.log("Fetching users...");
    
    // Fetch user data from API
    const fetchUsers = async () => {
      try {
        const api = await getAuthApi();
        const response = await api.get(endpoints['users']);
        console.log("Response:", response);
        console.log("Fetched users:", response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    console.log(users);

    fetchUsers();
  }, []);

  return (
    <div className="layout">
      <Sidebar />

      <div className="main-content">
        <Topbar />
        <div className="page-content">
          <h2>Users</h2>
          <div className="user-grid">
            {users.map((user, i) => (
              <UserCard key={user.id} user={user} isActive={i === 0} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
