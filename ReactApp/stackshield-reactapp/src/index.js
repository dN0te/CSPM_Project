import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const client = new QueryClient();

function Root() {
    // State for light/dark mode
    const [mode, setMode] = useState('light');
    const theme = useMemo(() =>
            createTheme({ palette: { mode } }),
        [mode]
    );

    const toggleDarkMode = () => {
        setMode(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeProvider theme={theme}>
            {/* נקי CSS בכל מצב */}
            <CssBaseline />
            <App onToggleDarkMode={toggleDarkMode} />
        </ThemeProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <QueryClientProvider client={client}>
            <Root />
        </QueryClientProvider>
    </React.StrictMode>
);
