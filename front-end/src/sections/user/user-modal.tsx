import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { UserProps } from './user-table-row';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (user: UserProps) => void;
  editingUser?: UserProps | null;
}

export function UserModal({ open, onClose, onSave, editingUser }: UserModalProps) {
  const [formData, setFormData] = useState<UserProps>({
    id: '',
    name: '',
    company: '',
    role: '',
    status: '',
    isVerified: false,
  });

  useEffect(() => {
    if (editingUser) {
      setFormData(editingUser);
    } else {
      clearData();
    }
  }, [editingUser, open]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = () => {
    // Validate form data before saving
    if (!formData.name || !formData.role || !formData.status) {
      alert('Please fill in all required fields');
      return;
    }

    onSave(formData);
    handleClose();
  };

  const clearData = () => {
    setFormData({
      id: '',
      name: '',
      company: '',
      role: '',
      status: '',
      isVerified: false,
    });
  };

  const handleClose = () => {
    onClose();
    clearData();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
      <DialogContent>
        <TextField
          required
          fullWidth
          margin="dense"
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleTextChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleTextChange}
        />
        <TextField
          required
          fullWidth
          margin="dense"
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleTextChange}
        />
        <FormControl 
          fullWidth 
          margin="dense" 
          required 
          variant="outlined"
        >
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            name="status"
            label="Status"
            value={formData.status}
            onChange={handleSelectChange}
          >
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox 
              name="isVerified" 
              checked={formData.isVerified} 
              onChange={handleCheckboxChange} 
            />
          }
          label="Verified"
        />
      </DialogContent>
      <DialogActions sx={{ mr: 2, mb: 1 }}>
        <Button 
          onClick={handleClose} 
          color="secondary"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
        >
          {editingUser ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}