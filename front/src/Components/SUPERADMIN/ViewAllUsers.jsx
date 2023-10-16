import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewAllUsers.css';
import {ImBlocked} from "react-icons/im";
import {CgUnblock} from "react-icons/cg";

function ViewAllUsers() {
  const [users, setUsers] = useState([]);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const api= "http://localhost:3001";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${api}/getAllUsers`); // Replace with your API endpoint
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []); // The empty dependency array means this effect runs once after the initial render

  const openBlockModal = (userId) => {
    setSelectedUserId(userId);
    setShowBlockModal(true);
  };

  const closeBlockModal = () => {
    setShowBlockModal(false);
  };

  const openUnblockModal = (userId) => {
    setSelectedUserId(userId);
    setShowUnblockModal(true);
  };

  const closeUnblockModal = () => {
    setShowUnblockModal(false);
  };

  const blockUser = async () => {
    try {
      await axios.put(`${api}/blockUser/${selectedUserId}`);
      // Assuming you have a function to update the user list after blocking
      // You can fetch the updated list here or use state to update it.
      setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === selectedUserId ? { ...user, isblocked: true } : user
      )
    );
    } catch (error) {
      console.error('Error blocking user:', error);
    }
    closeBlockModal();
  };

  const unblockUser = async () => {
    try {
      await axios.put(`${api}/unblockUser/${selectedUserId}`);
      setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === selectedUserId ? { ...user, isblocked: false } : user
      )
    );
      // Similarly, update the user list after unblocking here.
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
    closeUnblockModal();
  };
  
  return (
    <>
      <div className='tableparent'>
        <table className="content-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  {user.isblocked ? (
                    <>
                      <ImBlocked className='blockicon' onClick={() => openUnblockModal(user._id)} />
                      {showUnblockModal && (
                        <div className="modal">
                          <span className="close" title="Close Modal" onClick={closeUnblockModal}>
                            x
                          </span>
                          <form className="modal-content">
                            <div className="container">
                              <h1 className="modal-header">Unblock User</h1>
                              <p>Are you sure you want to unblock this user?</p>

                              <div className="clearfix">
                                <button type="button" className="cancelbtn" onClick={closeUnblockModal}>
                                  Cancel
                                </button>
                                <button type="button" className="unblokbtn" onClick={() => unblockUser()}>
                                  Unblock
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <CgUnblock className='unblockicon' onClick={() => openBlockModal(user._id)} />
                      {showBlockModal && (
                        <div className="modal">
                          <span className="close" title="Close Modal" onClick={closeBlockModal}>
                            x
                          </span>
                          <form className="modal-content">
                            <div className="container">
                              <h1 className="modal-header">Block User</h1>
                              <p>Are you sure you want to block this user?</p>

                              <div className="clearfix">
                                <button type="button" className="cancelbtn" onClick={closeBlockModal}>
                                  Cancel
                                </button>
                                <button type="button" className="blockbtn" onClick={() => blockUser()}>
                                  Block
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ViewAllUsers;
