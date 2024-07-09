import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, LocationOn, Event, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Adjust locale as needed
import UserContext from '../contexts/UserContext';

function Volunteers() {
    const [volunteerList, setVolunteerList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    useEffect(() => {
        getVolunteers();
    }, []);

    const getVolunteers = () => {
        http.get('/volunteer')
            .then((res) => setVolunteerList(res.data))
            .catch((error) => console.error('Error fetching volunteers:', error));
    };

    const searchVolunteers = () => {
        http.get(`/volunteer?search=${search}`)
            .then((res) => setVolunteerList(res.data))
            .catch((error) => console.error('Error searching volunteers:', error));
    };

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchVolunteers();
        }
    };

    const onClickSearch = () => {
        searchVolunteers();
    };

    const onClickClear = () => {
        setSearch('');
        getVolunteers();
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Volunteer Events
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input
                    value={search}
                    placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown}
                />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {user && (
                    <Link to="/addvolunteer">
                        <Button variant="contained">Add</Button>
                    </Link>
                )}
            </Box>
            <Grid container spacing={2}>
                {volunteerList.map((volunteer) => (
                    <Grid item xs={12} md={6} lg={4} key={volunteer.id}>
                        <Card>
                            {volunteer.uploadPhoto && (
                                <Box className="aspect-ratio-container">
                                    <img
                                        alt="volunteer"
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${volunteer.uploadPhoto}`}
                                    />
                                </Box>
                            )}
                            <CardContent>
                                <Box sx={{ display: 'flex', mb: 1 }}>
                                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                        {volunteer.title}
                                    </Typography>
                                    {user && user.id === volunteer.userId && (
                                        <Link to={`/editvolunteer/${volunteer.id}`}>
                                            <IconButton color="primary" sx={{ padding: '4px' }}>
                                                <Edit />
                                            </IconButton>
                                        </Link>
                                    )}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                    <AccountCircle sx={{ mr: 1 }} />
                                    <Typography>{volunteer.user?.name}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                    <AccessTime sx={{ mr: 1 }} />
                                    <Typography>
                                        {volunteer.time ? dayjs(volunteer.time, 'HH:mm:ss').format('HH:mm') : 'No Time Available'}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                    <Event sx={{ mr: 1 }} />
                                    <Typography>{dayjs(volunteer.date).format('DD MMM YYYY')}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                    <LocationOn sx={{ mr: 1 }} />
                                    <Typography>{volunteer.location}</Typography>
                                </Box>
                                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                    {volunteer.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Volunteers;
