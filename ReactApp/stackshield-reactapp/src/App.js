import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import {
    Container,
    Paper,
    Button,
    Box,
    CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useLogs } from './hooks/useLogs';
import AlertTable from './components/AlertTable';
import FilterBar from './components/FilterBar';
import ChartDashboard from './components/ChartDashboard';

export default function App({ onToggleDarkMode }) {
    const theme = useTheme();
    const [file, setFile] = useState(null);
    const [severityFilter, setSeverityFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const logsMutation = useLogs();

    const handleUpload = () => {
        if (file) logsMutation.mutate(file);
    };

    const data = logsMutation.data || [];

    const fuse = useMemo(
        () => new Fuse(data, {
            keys: [
                'alert.id', 'alert.service', 'alert.resource', 'alert.description',
                'alert.recommendation', 'alert.hostIp', 'alert.hostName',
                'log.eventID', 'log.eventName', 'log.eventTime',
                'log.sourceIPAddress', 'log.hostName'
            ],
            threshold: 0.3,
            ignoreLocation: true
        }),
        [data]
    );

    const searched = searchTerm
        ? fuse.search(searchTerm).map(r => r.item)
        : data;

    const filtered = severityFilter
        ? searched.filter(item => item.alert.severity === severityFilter)
        : searched;

    // Determine background based on theme mode
    const bg = theme.palette.mode === 'dark'
        ? '#000'
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: bg,
                color: theme.palette.text.primary,
                transition: 'background 0.3s ease'
            }}
        >
            <Container sx={{ py: 4 }}>
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <img
                        src="/website-logo.png"
                        alt="Stack Shield Alerts Dashboard"
                        style={{ height: 200, width: 'auto' }}
                    />
                </Box>

                <Paper
                    sx={{
                        p: 3,
                        mb: 4,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 2
                    }}
                >
                    <Box display="flex" alignItems="center" gap={2}>
                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<UploadFileIcon />}
                        >
                            Upload JSON Log
                            <input
                                type="file"
                                hidden
                                accept=".json"
                                onChange={e => setFile(e.target.files?.[0])}
                            />
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpload}
                            disabled={!file || logsMutation.isLoading}
                        >
                            Analyze
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => {
                                setSeverityFilter('');
                                setSearchTerm('');
                            }}
                        >
                            Clear Filters
                        </Button>

                        {logsMutation.isLoading && <CircularProgress size={24} />}
                    </Box>

                    {logsMutation.isError && (
                        <Box mt={2} sx={{ color: 'error.main' }}>
                            Error: {logsMutation.error.message}
                        </Box>
                    )}
                </Paper>

                {data.length > 0 && (
                    <>
                        <FilterBar
                            filter={severityFilter}
                            setFilter={setSeverityFilter}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />

                        <ChartDashboard
                            data={filtered}
                            onToggleDarkMode={onToggleDarkMode}
                        />
                        <AlertTable alerts={filtered} />
                    </>
                )}
            </Container>
        </Box>
    );
}