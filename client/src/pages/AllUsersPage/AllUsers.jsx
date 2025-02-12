import React, { useState, useEffect } from "react";
import "./AllUsers.css";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import LoadingSpin from "../../components/LoadingSpin";
import { errorMessages } from "../../constants/constants";
import { Modal } from "antd";

function AllUsers() {
    const [users, setUsers] = useState([]);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUserID, setSelectedUserID] = useState(null);
    const apiBaseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/users`);
                if (response?.data && Array.isArray(response.data)) {
                    setUsers(response.data);
                    setIsLoading(false);
                } else {
                    throw new Error(errorMessages.ERROR_DATA_FORMAT);
                }
            } catch (error) {
                console.error(errorMessages.ERROR_GET_USERS, error);
                setError(errorMessages.ERROR_GET_USERS);
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const formatDateTime = (date) => {
        const newDate = new Date(date);
        return `${newDate.toLocaleDateString()} ${newDate.toLocaleTimeString()}`;
    };

    const showModal = (userID) => {
        setSelectedUserID(userID);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedUserID(null);
    };

    const handleDelete = async () => {
        if (!selectedUserID) return;
        try {
            await axios.delete(`${apiBaseURL}/users/${selectedUserID}`);
            setUsers(users.filter((user) => user.userID !== selectedUserID));
            setIsModalVisible(false);
        } catch (err) {
            console.error(errorMessages.ERROR_DELETE_USER, err);
            setError(errorMessages.ERROR_DELETE_USER);
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "name", headerName: "Name", width: 150 },
        { field: "lastName", headerName: "Last Name", width: 150 },
        { field: "phone", headerName: "Phone", width: 150 },
        { field: "address", headerName: "Address", width: 150 },
        { field: "city", headerName: "City", width: 150 },
        { field: "country", headerName: "Country", width: 200 },
        { field: "postalCode", headerName: "Postal Code", width: 200 },
        { field: "birthday", headerName: "Birthday", width: 150 },
        { field: "email", headerName: "Email", width: 150 },
        { field: "admin", headerName: "Admin", width: 150 },
        {
            field: "Actions",
            headerName: "Actions",
            renderCell: (params) =>
                params.row.admin === "No" ? (
                    <button
                        onClick={() => showModal(params.row.id)}
                        className="delete-button">
                        Delete
                    </button>
                ) : null,
            width: 120,
        },
    ];

    if (isLoading) {
        return <LoadingSpin />;
    }

    return (
        <div className="all-users-page">
            <h1>All Users</h1>
            {error && <div className="error">{error}</div>}
            <Box sx={{ minHeight: "400px", width: "100%" }}>
                <DataGrid
                    columns={columns}
                    rows={users.map((user) => ({
                        id: user.userID,
                        name: user.name,
                        lastName: user.lastName,
                        phone: user.phone,
                        address: user.address,
                        city: user.city,
                        country: user.country,
                        postalCode: user.postalCode,
                        birthday: formatDateTime(user.birthday),
                        email: user.email,
                        admin: user.isAdmin ? "Yes" : "No",
                    }))}
                    components={{ Toolbar: GridToolbar }}
                    filterModel={filterModel}
                    onFilterModelChange={setFilterModel}
                    columnVisibilityModel={columnVisibilityModel}
                    onColumnVisibilityModelChange={setColumnVisibilityModel}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{ toolbar: { showQuickFilter: true } }}
                    localeText={{
                        noRowsLabel: "No results found",
                    }}
                />
            </Box>

            <Modal
                title="Confirm Delete"
                open={isModalVisible}
                onOk={handleDelete}
                onCancel={handleCancel}
                okText="Delete"
                cancelText="Cancel">
                <p>Are you sure you want to delete this user?</p>
            </Modal>
        </div>
    );
}

export default AllUsers;
