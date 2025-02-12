import React, {
    useState,
    useEffect,
    useContext,
    useCallback,
    useMemo,
} from "react";
import axios from "axios";
import { UserContext } from "../../../context/userContext";
import "./MyReservations.css";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import toast from "react-hot-toast";
import { Modal, Input } from "antd";
import { errorMessages, successMessages } from "../../constants/constants";
import LoadingSpin from "../../components/LoadingSpin";

function MyReservations() {
    const { user, isLoading: userLoading } = useContext(UserContext);
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiBaseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
    const [reservationToDelete, setReservationToDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quickSearch, setQuickSearch] = useState("");
    const [filterModel, setFilterModel] = useState({
        items: [],
    });
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

    useEffect(() => {
        if (userLoading) return;

        if (!user) {
            setError(errorMessages.ERROR_NOT_LOGGED_IN);
            setIsLoading(false);
            return;
        }

        const fetchReservations = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/reservations`);

                if (response?.data && Array.isArray(response.data)) {
                    const userReservations = response.data.filter(
                        (reservation) =>
                            user.userID === String(reservation.userID).trim()
                    );
                    setReservations(userReservations);
                } else {
                    throw new Error(errorMessages.ERROR_DATA_FORMAT);
                }
            } catch (err) {
                console.error(err);
                setError(ERROR_GET_RESERVATIONS);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReservations();
    }, [user, userLoading, apiBaseURL]);

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    const cancelReservation = useCallback(async () => {
        if (!reservationToDelete) return;

        try {
            await axios.delete(
                `${apiBaseURL}/reservations/${reservationToDelete}`
            );
            setReservations((prevReservations) =>
                prevReservations.filter(
                    (reservation) =>
                        reservation.reservationID !== reservationToDelete
                )
            );
            toast.success(successMessages.SUCCESS_CANCELED);
        } catch (err) {
            console.error(err);
            setError(errorMessages.ERROR_FAILED_CANCEL);
            toast.error(errorMessages.ERROR_FAILED_CANCEL);
        } finally {
            setIsModalOpen(false);
        }
    }, [reservationToDelete, apiBaseURL]);

    const MILLISECONDS_IN_A_SECOND = 1000;
    const SECONDS_IN_A_MINUTE = 60;
    const MINUTES_IN_AN_HOUR = 60;
    const HOURS_IN_A_DAY = 24;

    const millisecondsInADay =
        MILLISECONDS_IN_A_SECOND *
        SECONDS_IN_A_MINUTE *
        MINUTES_IN_AN_HOUR *
        HOURS_IN_A_DAY;

    const columns = useMemo(() => {
        return [
            {
                field: "PickupDate",
                headerName: "Pickup Date",
                width: 200,
                valueFormatter: (params) => formatDateTime(params),
            },
            {
                field: "ReturnDate",
                headerName: "Return Date",
                width: 200,
                valueFormatter: (params) => formatDateTime(params),
            },
            { field: "CarMake", headerName: "Car Make", width: 150 },
            { field: "CarModel", headerName: "Car Model", width: 150 },
            { field: "CarYear", headerName: "Car Year", width: 120 },
            { field: "TotalPrice", headerName: "Total Price", width: 150 },
            {
                field: "actions",
                headerName: "Actions",
                width: 150,
                renderCell: (params) => {
                    const reservationStartDate = new Date(
                        params.row.rawStartDate
                    );
                    const currentDate = new Date();
                    const daysDifference =
                        (reservationStartDate - currentDate) /
                        millisecondsInADay;

                    return daysDifference > 3 ? (
                        <button
                            className="cancel-button"
                            onClick={() => {
                                setIsModalOpen(true);
                                setReservationToDelete(params.row.id);
                            }}>
                            Cancel
                        </button>
                    ) : (
                        <span className="cannot-cancel-text">
                            Cannot Cancel
                        </span>
                    );
                },
            },
        ];
    }, [millisecondsInADay]);

    const sxProps = {
        marginBottom: 2,
    };

    const rows = useMemo(
        () =>
            reservations.map((reservation) => ({
                id: reservation.reservationID,
                PickupDate: reservation.startDate,
                ReturnDate: reservation.endDate,
                CarMake: reservation.carMake,
                CarModel: reservation.carModel,
                CarYear: reservation.carYear,
                TotalPrice: reservation.totalPrice,
                rawStartDate: reservation.startDate,
            })),
        [reservations]
    );

    const filteredRows = useMemo(() => {
        if (!quickSearch) return rows;
        return rows.filter((row) => {
            const searchQuery = quickSearch.toLowerCase();
            return (
                row.PickupDate.toLowerCase().includes(searchQuery) ||
                row.ReturnDate.toLowerCase().includes(searchQuery) ||
                row.CarMake.toLowerCase().includes(searchQuery) ||
                row.CarModel.toLowerCase().includes(searchQuery) ||
                row.CarYear.toString().includes(searchQuery) ||
                row.TotalPrice.toString().includes(searchQuery)
            );
        });
    }, [quickSearch, rows]);

    if (isLoading) return <LoadingSpin />;

    if (error) return <p>Error: {error}</p>;

    return (
        <div className="all-reservations-page">
            <h1>My Reservations</h1>
            <p className="my-reservations-information-text">
                ! Please note that cancellations are only possible up to 3 days
                before the scheduled pickup date. After this period,
                cancellations will not be accepted.
            </p>

            <Box>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    pagination
                    components={{ Toolbar: GridToolbar }}
                    filterModel={filterModel}
                    onFilterModelChange={setFilterModel}
                    columnVisibilityModel={columnVisibilityModel}
                    onColumnVisibilityModelChange={setColumnVisibilityModel}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{ toolbar: { showQuickFilter: true } }}
                    autoHeight
                    localeText={{
                        noRowsLabel: "No results found",
                    }}
                />
            </Box>

            <Modal
                title="Are you sure you want to cancel this reservation?"
                open={isModalOpen}
                onOk={cancelReservation}
                onCancel={() => setIsModalOpen(false)}
                okText="Yes"
                cancelText="No">
                <p>Once cancelled, this action cannot be undone.</p>
            </Modal>
        </div>
    );
}

export default MyReservations;
