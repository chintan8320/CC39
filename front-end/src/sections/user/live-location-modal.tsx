import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

interface LiveLocationModalProps {
  open: boolean;
  onClose: () => void;
}

interface Location {
  lat: number;
  lng: number;
}

export function LiveLocationModal({ open, onClose }: LiveLocationModalProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isTracking && open) {
      const fetchLocation = async () => {
        try {
          const response = await fetch('https://cc39.onrender.com/live-location');
          if (!response.ok) {
            throw new Error('Failed to fetch location');
          }
          const location: Location = await response.json();
          setCurrentLocation(location);
          setError(null);
        } catch (err) {
          console.error('Location tracking error:', err);
          setError('Unable to fetch live location');
          setIsTracking(false);
        }
      };

      // Fetch immediately when tracking starts
      fetchLocation();

      // Then set up interval to fetch every second
      intervalId = setInterval(fetchLocation, 1000);
    }

    // Cleanup on unmount or when tracking stops
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTracking, open]);

  // Reset tracking when modal closes
  useEffect(() => {
    if (!open) {
      setIsTracking(false);
      setCurrentLocation(null);
      setError(null);
    }
  }, [open]);

  const handleShowLiveLocation = () => {
    setIsTracking(true);
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    setCurrentLocation(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Live Location Tracking</DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ width: '100%' }}>
          {error && (
            <Box 
              sx={{ 
                bgcolor: 'error.light', 
                color: 'error.contrastText', 
                p: 2, 
                borderRadius: 1,
                mb: 2 
              }}
            >
              {error}
            </Box>
          )}

          {currentLocation ? (
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: 'grey.100', 
                borderRadius: 2 
              }}
            >
              <Typography variant="h6" gutterBottom>
                Current Location
              </Typography>
              <Typography>
                Latitude: {currentLocation.lat.toFixed(4)}
              </Typography>
              <Typography>
                Longitude: {currentLocation.lng.toFixed(4)}
              </Typography>
              
              {/* Placeholder for Google Maps integration */}
              <Box 
                sx={{ 
                  mt: 2, 
                  bgcolor: 'grey.200', 
                  height: 300, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                <Typography color="text.secondary">
                  Google Maps would be rendered here with marker at 
                  ({currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)})
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box 
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                color: 'text.secondary' 
              }}
            >
              {isTracking 
                ? "Fetching location..." 
                : "No location data available. Click \"Start Live Location\" to begin tracking."}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<Iconify icon="mdi:play" />}
            onClick={handleShowLiveLocation}
            disabled={isTracking}
          >
            Start Live Location
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Iconify icon="mdi:stop" />}
            onClick={handleStopTracking}
            disabled={!isTracking}
          >
            Stop Tracking
          </Button>
        </Box>
        <Button 
          variant="outlined" 
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}