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
          dateAvailable: '',
          serviceType: '',
          comments: '',
          timeAvailable: '',
          duration: '',
          contactInfo: '',
        },
        validationSchema: yup.object({
          dateAvailable: yup.date().required('Date Available is required'),
          serviceType: yup.string().required('Service Type is required'),
          comments: yup.string().max(500, 'Comments must be at most 500 characters'),
          timeAvailable: yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid Time format').required('Time Available is required'),
          duration: yup.number().integer().min(0, 'Duration must be at least 0').nullable(),
          contactInfo: yup.string().max(100, 'Contact Info must be at most 100 characters').nullable(),
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.serviceType = data.serviceType.trim();
            data.comments = data.comments.trim();
            data.duration = data.duration ? parseInt(data.duration) : null;
            data.contactInfo = data.contactInfo.trim();
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
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Date Available"
                            type="date"
                            name="dateAvailable"
                            value={formik.values.dateAvailable}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.dateAvailable && Boolean(formik.errors.dateAvailable)}
                            helperText={formik.touched.dateAvailable && formik.errors.dateAvailable}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Service Type"
                            name="serviceType"
                            value={formik.values.serviceType}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.serviceType && Boolean(formik.errors.serviceType)}
                            helperText={formik.touched.serviceType && formik.errors.serviceType}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            multiline
                            minRows={2}
                            label="Comments"
                            name="comments"
                            value={formik.values.comments}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.comments && Boolean(formik.errors.comments)}
                            helperText={formik.touched.comments && formik.errors.comments}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Time Available"
                            type="time"
                            name="timeAvailable"
                            value={formik.values.timeAvailable}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.timeAvailable && Boolean(formik.errors.timeAvailable)}
                            helperText={formik.touched.timeAvailable && formik.errors.timeAvailable}
                            inputProps={{ step: 300 }}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Duration (in hours)"
                            type="number"
                            name="duration"
                            value={formik.values.duration}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.duration && Boolean(formik.errors.duration)}
                            helperText={formik.touched.duration && formik.errors.duration}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Contact Info"
                            name="contactInfo"
                            value={formik.values.contactInfo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.contactInfo && Boolean(formik.errors.contactInfo)}
                            helperText={formik.touched.contactInfo && formik.errors.contactInfo}
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