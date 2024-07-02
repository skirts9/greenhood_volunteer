import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs'; // Import dayjs for time formatting
import 'dayjs/locale/en'; // Adjust locale as needed

function EditVolunteer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [volunteer, setVolunteer] = useState({
    title: "",
    location: "",
    date: "",
    time: "",
    briefDescription: "",
    detailedDescription: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get(`/volunteer/${id}`)
      .then((res) => {
        setVolunteer(res.data);
        setImageFile(res.data.imageFile);
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was an error fetching the volunteer data!', error);
        toast.error('Error fetching volunteer data');
      });
  }, [id]);

  const formik = useFormik({
    initialValues: volunteer,
    enableReinitialize: true,
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
      time: yup.string().trim().required('Time is required'),
      briefDescription: yup.string().trim().max(500, 'Brief description must be at most 500 characters'),
      detailedDescription: yup.string().trim().max(1000, 'Detailed description must be at most 1000 characters')
    }),
    onSubmit: (data) => {
      if (imageFile) {
        data.imageFile = imageFile;
      }
      data.title = data.title.trim();
      data.location = data.location.trim();
      data.time = data.time.trim(); // Ensure time is trimmed
      data.briefDescription = data.briefDescription.trim();
      data.detailedDescription = data.detailedDescription.trim();
      http.put(`/volunteer/${id}`, data)
        .then((res) => {
          console.log(res.data);
          navigate("/volunteers");
        })
        .catch((error) => {
          console.error('There was an error updating the volunteer data!', error);
          toast.error('Error updating volunteer data');
        });
    }
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteVolunteer = () => {
    http.delete(`/volunteer/${id}`)
      .then((res) => {
        console.log(res.data);
        navigate("/volunteers");
      })
      .catch((error) => {
        console.error('There was an error deleting the volunteer!', error);
        toast.error('Error deleting volunteer');
      });
  }

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

  const formatTime = (time) => {
    return dayjs(time, "HH:mm:ss").format("HH:mm");
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit volunteer
      </Typography>
      {
        !loading && (
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
                  type="time"
                  label="Time"
                  name="time"
                  value={formik.values.time}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.time && Boolean(formik.errors.time)}
                  helperText={formik.touched.time && formik.errors.time}
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
                Update
              </Button>
              <Button variant="contained" sx={{ ml: 2 }} color="error"
                onClick={handleOpen}>
                Delete
              </Button>
            </Box>
          </Box>
        )
      }

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Delete volunteer
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit"
            onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error"
            onClick={deleteVolunteer}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
}

export default EditVolunteer;
