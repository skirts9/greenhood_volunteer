import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import 'dayjs/locale/en';

function EditVolunteer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState({
    dateAvailable: "",
    serviceType: "",
    comments: "",
    timeAvailable: "",
    duration: "",
    uploadPhoto: "",
    contactInfo: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get(`/tickets/${id}`)
      .then((res) => {
        setTicket(res.data);
        setImageFile(res.data.uploadPhoto);
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was an error fetching the ticket data!', error);
        toast.error('Error fetching ticket data');
      });
  }, [id]);

  const formik = useFormik({
    initialValues: ticket,
    enableReinitialize: true,
    validationSchema: yup.object({
      dateAvailable: yup.date().required('Date Available is required'),
      serviceType: yup.string().trim()
        .min(3, 'Service Type must be at least 3 characters')
        .max(100, 'Service Type must be at most 100 characters')
        .required('Service Type is required'),
      comments: yup.string().trim().max(500, 'Comments must be at most 500 characters'),
      timeAvailable: yup.string().trim().required('Time Available is required'),
      duration: yup.string().trim().required('Duration is required'),
      contactInfo: yup.string().trim().required('Contact Info is required')
    }),
    onSubmit: (data) => {
      if (imageFile) {
        data.uploadPhoto = imageFile;
      }
      data.serviceType = data.serviceType.trim();
      data.timeAvailable = data.timeAvailable.trim();
      data.comments = data.comments.trim();
      data.duration = data.duration.trim();
      data.contactInfo = data.contactInfo.trim();
      http.put(`/tickets/${id}`, data)
        .then((res) => {
          console.log(res.data);
          navigate("/tickets");
        })
        .catch((error) => {
          console.error('There was an error updating the ticket data!', error);
          toast.error('Error updating ticket data');
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

  const deleteTicket = () => {
    http.delete(`/tickets/${id}`)
      .then((res) => {
        console.log(res.data);
        navigate("/tickets");
      })
      .catch((error) => {
        console.error('There was an error deleting the ticket!', error);
        toast.error('Error deleting ticket');
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
        Edit Ticket
      </Typography>
      {
        !loading && (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={8}>
                <TextField
                  fullWidth margin="dense" autoComplete="off"
                  type="date"
                  label="Date Available"
                  name="dateAvailable"
                  value={formik.values.dateAvailable}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.dateAvailable && Boolean(formik.errors.dateAvailable)}
                  helperText={formik.touched.dateAvailable && formik.errors.dateAvailable}
                />
                <TextField
                  fullWidth margin="dense" autoComplete="off"
                  label="Service Type"
                  name="serviceType"
                  value={formik.values.serviceType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.serviceType && Boolean(formik.errors.serviceType)}
                  helperText={formik.touched.serviceType && formik.errors.serviceType}
                />
                <TextField
                  fullWidth margin="dense" autoComplete="off"
                  multiline minRows={2}
                  label="Comments"
                  name="comments"
                  value={formik.values.comments}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.comments && Boolean(formik.errors.comments)}
                  helperText={formik.touched.comments && formik.errors.comments}
                />
                <TextField
                  fullWidth margin="dense" autoComplete="off"
                  label="Time Available"
                  name="timeAvailable"
                  type="time"
                  value={formik.values.timeAvailable}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.timeAvailable && Boolean(formik.errors.timeAvailable)}
                  helperText={formik.touched.timeAvailable && formik.errors.timeAvailable}
                  inputProps={{ step: 300 }} // Set step to 5 minutes (300 seconds)
                />
                <TextField
                  fullWidth margin="dense" autoComplete="off"
                  label="Duration"
                  name="duration"
                  value={formik.values.duration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.duration && Boolean(formik.errors.duration)}
                  helperText={formik.touched.duration && formik.errors.duration}
                />
                <TextField
                  fullWidth margin="dense" autoComplete="off"
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
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button variant="contained" component="label">
                    Upload Image
                    <input hidden accept="image/*" multiple type="file"
                      onChange={onFileChange} />
                  </Button>
                  {
                    imageFile && (
                      <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                        <img alt="ticket"
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
              <Button variant="outlined" color="error" sx={{ ml: 2 }} onClick={handleOpen}>
                Delete
              </Button>
            </Box>
          </Box>
        )
      }
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this ticket? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteTicket} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Box>
  );
}

export default EditVolunteer;
