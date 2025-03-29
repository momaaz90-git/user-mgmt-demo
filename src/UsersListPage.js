import React, { useEffect, useState } from "react";
import axiosInstance from "./axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router

const UsersListPage = () => {
    const [users, setUsers] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false); // To show the edit form (modal)
    const [selectedUser, setSelectedUser] = useState(null); // To store selected user for editing
    const [editFormData, setEditFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
    });
    const [message, setMessage] = useState(""); // For showing success/error messages
    const [messageType, setMessageType] = useState(""); // To control the banner style (success/error)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // To show delete confirmation modal
    const [userToDelete, setUserToDelete] = useState(null); // To store the user to delete
    const [showMessage, setShowMessage] = useState(false); // State to control banner visibility

    const navigate = useNavigate(); // Initialize useNavigate for redirecting

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (token) {
            setIsAuthenticated(true);
            fetchUsers(currentPage);
        } else {
            navigate("/");
        }
    }, [currentPage, navigate]);

    const fetchUsers = async (page) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`api/users`, {
                params: { page: page },
            });
            setUsers(response.data.data);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditFormData({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        });
        setShowEditForm(true);
    };

    const handleDeleteClick = (userId) => {
        setUserToDelete(userId);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            await axiosInstance.delete(`/api/users/${userToDelete}`);
            setMessage("User deleted successfully");
            setMessageType("success");
            setUsers(users.filter((user) => user.id !== userToDelete)); // Remove the user from the list
        } catch (error) {
            setMessage("Error deleting user");
            setMessageType("error");
        } finally {
            setShowDeleteConfirm(false); // Close the delete confirmation modal
            setShowMessage(true); // Show the message banner
            // Hide the message banner after 5 seconds
            setTimeout(() => {
                setShowMessage(false);
            }, 5000);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false); // Close the delete confirmation modal without deleting
    };

    const handleEditFormSubmit = async (e) => {
        e.preventDefault();

        try {
            await axiosInstance.put(`/api/users/${selectedUser.id}`, {
                first_name: editFormData.first_name,
                last_name: editFormData.last_name,
                email: editFormData.email,
            });
            setMessage("User updated successfully");
            setMessageType("success");
            setUsers(
                users.map((user) =>
                    user.id === selectedUser.id ? { ...user, ...editFormData } : user
                )
            );
            setShowEditForm(false); // Close the edit form (modal)
        } catch (error) {
            setMessage("Error updating user");
            setMessageType("error");
        } finally {
            setShowMessage(true); // Show the message banner
            // Hide the message banner after 5 seconds
            setTimeout(() => {
                setShowMessage(false);
            }, 5000);
        }
    };

    const handleModalClose = () => {
        setShowEditForm(false); // Close the modal without making changes
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div>
            {/* Display banner message */}
            {showMessage && (
                <div className={`message-banner ${messageType}`}>
                    <p>{message}</p>
                </div>
            )}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {/* User data display */}
                    <div className="user-list">
                        {users.map((user) => (
                            <div key={user.id} className="user-card">
                                <img
                                    src={user.avatar}
                                    alt={user.first_name}
                                    className="user-avatar"
                                />
                                <div className="user-info">
                                    <h4>
                                        {user.first_name} {user.last_name}
                                    </h4>
                                    <p>{user.email}</p>
                                    <button
                                        onClick={() => handleDeleteClick(user.id)}
                                        className="icon-button"
                                    >
                                        <i className="fa fa-trash" aria-hidden="true"></i>
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(user)}
                                        className="icon-button"
                                    >
                                        <i className="fa fa-pencil" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination controls */}
                    <Pagination currentPage={currentPage} totalPages={totalPages} onChange={handlePageChange} />
                </div>
            )}

            {showEditForm && <UserEditMOdal
                    onSubmit={handleEditFormSubmit}
                    data={editFormData}
                    setData={setEditFormData}
                    onClose={handleModalClose}
                />
            }
            {showDeleteConfirm && <DeleteModal onOk={confirmDelete} onCancel={cancelDelete} />}
        </div>
    );
};

//Pagination
const Pagination = ({ currentPage, totalPages, onChange }) => {
    return <div className="pagination">
        <button
            onClick={() => onChange(currentPage - 1)}
            disabled={currentPage === 1}
        >
            Previous
        </button>
        <span>
            Page {currentPage} of {totalPages}
        </span>
        <button
            onClick={() => onChange(currentPage + 1)}
            disabled={currentPage === totalPages}
        >
            Next
        </button>
    </div>
};

//Edit User Modal overlay
const UserEditMOdal = ({ onSubmit, data, setData, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Edit User</h3>
                <form onSubmit={onSubmit}>
                    <div>
                        <label>First Name:</label>
                        <input
                            type="text"
                            value={data.first_name}
                            onChange={(e) => setData({ ...data, first_name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <input
                            type="text"
                            value={data.last_name}
                            onChange={(e) => setData({ ...data, last_name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                    </div>
                    <button type="submit">Update User</button>
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

//Delate User Modal overlay
const DeleteModal = ({ onOk, onCancel }) => {
    return <div className="modal-overlay">
        <div className="modal-content">
            <h3>Are you sure you want to delete this user?</h3>
            <div>
                <button onClick={onOk}>Yes, Delete</button>
                <button type="button" onClick={onCancel}> Cancel </button>
            </div>
        </div>
    </div>;
};
export default UsersListPage;
