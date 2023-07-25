import React, { useState } from 'react';
import { TextField, Button, Container, Box } from '@mui/material';

interface HandlesFormProps {
  onAddHandle: (handle: string) => void;
}

const HandlesForm: React.FC<HandlesFormProps> = ({ onAddHandle }) => {
  const [handle, setHandle] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (handle.trim() !== '') {
      onAddHandle(handle.trim());
      setHandle('');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4} textAlign="center">
        <form onSubmit={handleSubmit}>
          <TextField
            label="Codeforces Handle"
            variant="outlined"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            fullWidth
            required
          />
          <Button variant="contained" type="submit" color="primary" sx={{ mt: 2 }}>
            Add Handle
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default HandlesForm;
