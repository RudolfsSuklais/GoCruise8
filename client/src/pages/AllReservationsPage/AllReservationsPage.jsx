import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "./AllReservationsPage.css";
import { Modal } from "antd";
import { errorMessages } from "../../constants/constants";
import LoadingSpin from "../../components/LoadingSpin";

function AllReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
    const [error, setError] = useState(null);
    const [reservationToDelete, setReservationToDelete] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterModel, setFilterModel] = useState({
        items: [],
    });
    const apiBaseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "Name", headerName: "Name", width: 150 },
        { field: "lastName", headerName: "Last Name", width: 150 },
        { field: "email", headerName: "Email", width: 150 },
        { field: "address", headerName: "Address", width: 150 },
        { field: "phone", headerName: "Phone", width: 150 },
        { field: "city", headerName: "City", width: 150 },
        { field: "pickUpDate", headerName: "Pickup Date", width: 150 },
        { field: "returnDate", headerName: "Return Date", width: 150 },
        { field: "carMake", headerName: "Car Make", width: 150 },
        { field: "carModel", headerName: "Car Model", width: 150 },
        { field: "carYear", headerName: "Car Year", width: 150 },
        { field: "totalPrice", headerName: "Total Price", width: 150 },
        {
            field: "Actions",
            headerName: "Actions",
            renderCell: (params) => (
                <button
                    className="delete-button"
                    onClick={() => showModal(params.row.id)}>
                    Delete
                </button>
            ),
            width: 120,
        },
    ];

    const sxStyles = {
        searchInput: {
            width: "50%",
            backgroundColor: "white",
            borderRadius: "5px",
        },
    };

    const fetchReservations = async () => {
        try {
            const response = await axios.get(`${apiBaseURL}/reservations`);
            if (response?.data && Array.isArray(response.data)) {
                setReservations(response.data);
                setFilteredReservations(response.data);
            } else {
                throw new Error(errorMessages.ERROR_DATA_FORMAT);
            }
        } catch (err) {
            console.error(err);
            setError(errorMessages.ERROR_GET_RESERVATIONS);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    useEffect(() => {
        setFilteredReservations(
            reservations.filter((reservation) =>
                Object.values(reservation).some((value) =>
                    value
                        .toString()
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                )
            )
        );
    }, [searchQuery, reservations]);

    const showModal = (id) => {
        setReservationToDelete(id);
        setIsLoading(false);
        setOpen(true);
    };

    const handleOk = async () => {
        if (!reservationToDelete) return;
        setConfirmLoading(true);
        setIsLoading(false);

        try {
            await axios.delete(
                `${apiBaseURL}/reservations/${reservationToDelete}`
            );

            setReservations((prev) =>
                prev.filter(
                    (reservation) =>
                        reservation.reservationID !== reservationToDelete
                )
            );
            setIsLoading(false);

            setReservationToDelete(null);
        } catch (err) {
            console.error(errorMessages.ERROR_DELETE_RESERVATION, err);
            setError(errorMessages.ERROR_DELETE_RESERVATION);
            setIsLoading(false);
        } finally {
            setConfirmLoading(false);
            setOpen(false);
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setOpen(false);
        setReservationToDelete(null);
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(date);
    };

    const handleSearchChange = () => {
        setFilteredReservations(
            reservations.filter((reservation) =>
                Object.values(reservation).some((value) =>
                    value
                        .toString()
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                )
            )
        );
    };

    if (isLoading) {
        return <LoadingSpin />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="all-reservations-page">
            <h1>All Reservations</h1>

            <Box sx={{ minHeight: "300px", width: "100%" }}>
                <DataGrid
                    columns={columns}
                    rows={filteredReservations.map((reservation) => ({
                        id: reservation.reservationID,
                        Name: reservation.name,
                        lastName: reservation.lastName,
                        email: reservation.email,
                        address: reservation.address,
                        phone: reservation.phone,
                        city: reservation.city,
                        pickUpDate: formatDateTime(reservation.startDate),
                        returnDate: formatDateTime(reservation.endDate),
                        carMake: reservation.carMake,
                        carModel: reservation.carModel,
                        carYear: reservation.carYear,
                        totalPrice: reservation.totalPrice,
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
                title="Are you sure?"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}>
                <p>Deleting this reservation cannot be undone.</p>
            </Modal>
        </div>
    );
}

export default AllReservationsPage;
