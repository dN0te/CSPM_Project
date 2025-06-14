// src/components/FilterBar.jsx
import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function FilterBar({
                                      filter: severityFilter,
                                      setFilter: setSeverityFilter,
                                      searchTerm,
                                      setSearchTerm
                                  }) {
    return (
        <Box display="flex" alignItems="center" gap={2} mb={2}>
            <FormControl size="small">
                <InputLabel>Severity</InputLabel>
                <Select
                    value={severityFilter}
                    label="Severity"
                    onChange={e => setSeverityFilter(e.target.value)}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Critical">Critical</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                </Select>
            </FormControl>

            <TextField
                size="small"
                label="Search text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                sx={{ flex: 1 }}
            />
        </Box>
    );
}
