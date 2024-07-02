import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import dayjs from 'dayjs'; // Import dayjs for time formatting
import 'dayjs/locale/en'; // Adjust locale as needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddVolunteer() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);

    const formik = useFormik({
        initialValues: {
            title: "",
            location: "",
            date: "",
            time: "",
            briefDescription: "",
            detailedDescription: ""
        },
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            location: yup.string().trim()
                .min(3, 'Location must be at least 3 characters')
                .max(100, 'Location must be at most 100 characters')
                .required('Location is required'),
            date: yup.date().required('Date is required'),
            time: yup.string().trim()
                .required('Time is required'),
            briefDescription: yup.string().trim()
                .max(500, 'Brief description must be at most 500 characters'),
            detailedDescription: yup.string().trim()
                .max(1000, 'Detailed description must be at most 1000 characters')
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.title = data.title.trim();
            data.briefDescription = data.briefDescription.trim();
            data.detailedDescription = data.detailedDescription.trim();
            http.post("/volunteer", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/Volunteers");
                })
                .catch((err) => {
                    console.log(err.response);
                    toast.error('Failed to add event!');
                });
        }
    });

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            let formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add volunteer
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Location"
                            name="location"
                            value={formik.values.location}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.location && Boolean(formik.errors.location)}
                            helperText={formik.touched.location && formik.errors.location}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            type="date"
                            label="Date"
                            name="date"
                            value={formik.values.date}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.date && Boolean(formik.errors.date)}
                            helperText={formik.touched.date && formik.errors.date}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Time"
                            name="time"
                            type="time" // Change input type to "time"
                            value={formik.values.time}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.time && Boolean(formik.errors.time)}
                            helperText={formik.touched.time && formik.errors.time}
                            inputProps={{ step: 300 }} // Set step to 5 minutes (300 seconds)
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={2}
                            label="Brief Description"
                            name="briefDescription"
                            value={formik.values.briefDescription}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.briefDescription && Boolean(formik.errors.briefDescription)}
                            helperText={formik.touched.briefDescription && formik.errors.briefDescription}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={4}
                            label="Detailed Description"
                            name="detailedDescription"
                            value={formik.values.detailedDescription}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.detailedDescription && Boolean(formik.errors.detailedDescription)}
                            helperText={formik.touched.detailedDescription && formik.errors.detailedDescription}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box sx={{ textAlign: 'center', mt: 2 }} >
                            <Button variant="contained" component="label">
                                Upload Image
                                <input hidden accept="image/*" multiple type="file"
                                    onChange={onFileChange} />
                            </Button>
                            {
                                imageFile && (
                                    <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                        <img alt="volunteer"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
                                        </img>
                                    </Box>
                                )
                            }
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>

            <ToastContainer />
        </Box>
    );
}

export default AddVolunteer;
