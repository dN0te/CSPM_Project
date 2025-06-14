import React, { useState, useMemo } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Paper,
    Fab,
    Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip as ChartTooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#B370EF'];

const TIME_RANGES = [
    { value: 'all', label: 'All Time' },
    { value: '1d', label: 'Past 1 Day' },
    { value: '2d', label: 'Past 2 Days' },
    { value: '7d', label: 'Past 7 Days' },
    { value: '30d', label: 'Past 30 Days' }
];

export default function ChartDashboard({ data = [], onToggleDarkMode }) {
    const theme = useTheme();
    const [timeRange, setTimeRange] = useState('all');

    const threshold = useMemo(() => {
        const now = Date.now();
        switch (timeRange) {
            case '1d': return now - 1 * 24 * 60 * 60 * 1000;
            case '2d': return now - 2 * 24 * 60 * 60 * 1000;
            case '7d': return now - 7 * 24 * 60 * 60 * 1000;
            case '30d': return now - 30 * 24 * 60 * 60 * 1000;
            default: return null;
        }
    }, [timeRange]);

    const filtered = useMemo(
        () => data.filter(item => {
            if (!item.alert) return false;
            if (!threshold) return true;
            const ts = new Date(item.log.eventTime || item.alert.timestamp).getTime();
            return ts >= threshold;
        }),
        [data, threshold]
    );

    const totalAlerts = filtered.length;
    const uniqueServices = new Set(filtered.map(i => i.alert.service)).size;
    const criticalCount = filtered.filter(i => i.alert.severity === 'Critical').length;

    const pieBySeverity = useMemo(() => {
        const counts = filtered.reduce((acc, item) => {
            const sev = item.alert.severity || 'Unknown';
            acc[sev] = (acc[sev] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [filtered]);

    const pieByService = useMemo(() => {
        const counts = filtered.reduce((acc, item) => {
            const svc = item.alert.service || 'Unknown';
            acc[svc] = (acc[svc] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [filtered]);

    const barData = useMemo(() => {
        const counts = filtered.reduce((acc, item) => {
            const host = item.alert.hostName || 'Unknown';
            acc[host] = (acc[host] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts)
            .map(([host, count]) => ({ host, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }, [filtered]);

    const lineData = useMemo(() => {
        const counts = filtered.reduce((acc, item) => {
            const ts = item.alert.timestamp || item.log.eventTime;
            const day = ts ? new Date(ts).toISOString().split('T')[0] : 'Unknown';
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts)
            .sort(([a], [b]) => new Date(a) - new Date(b))
            .map(([date, count]) => ({ date, count }));
    }, [filtered]);

    return (
        <Box sx={{ position: 'relative', width: '100%' }}>
            <Tooltip title="Toggle Dark Mode">
                <Fab
                    color="primary"
                    onClick={onToggleDarkMode}
                    sx={{
                        position: 'fixed',
                        top: theme.spacing(2),
                        left: '75vw',
                        transform: 'translateX(-50%)',
                        zIndex: 1100
                    }}
                >
                    <Brightness4Icon />
                </Fab>
            </Tooltip>

            <Box mb={3} display="flex" alignItems="center" gap={2}>
                <FormControl size="small">
                    <InputLabel>Time Range</InputLabel>
                    <Select
                        value={timeRange}
                        label="Time Range"
                        onChange={e => setTimeRange(e.target.value)}
                    >
                        {TIME_RANGES.map(opt => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="outlined" onClick={() => setTimeRange('all')}>Reset</Button>
            </Box>

            <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
                <StatBox label="Total Alerts" value={totalAlerts} />
                <StatBox label="Critical Alerts" value={criticalCount} />
                <StatBox label="Unique Services" value={uniqueServices} />
            </Box>

            <Box display="flex" flexWrap="wrap" gap={4} mb={4}>
                <ChartBox title="By Severity">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={pieBySeverity} dataKey="value" nameKey="name" outerRadius={80} label>
                                {pieBySeverity.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <ChartTooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartBox>
                <ChartBox title="By Service">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={pieByService} dataKey="value" nameKey="name" outerRadius={80} label>
                                {pieByService.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <ChartTooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartBox>
            </Box>

            {/* Side-by-side Bar and Line Charts */}
            <Box display="flex" flexWrap="wrap" gap={4} mb={4}>
                <ChartBox title="Top 10 Hosts">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <XAxis dataKey="host" />
                            <YAxis allowDecimals={false} />
                            <ChartTooltip />
                            <Legend />
                            <Bar dataKey="count" fill={COLORS[2]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartBox>

                <ChartBox title="Over Time">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineData}>
                            <XAxis dataKey="date" />
                            <YAxis allowDecimals={false} />
                            <ChartTooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke={COLORS[1]} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartBox>
            </Box>
        </Box>
    );
}

const StatBox = ({ label, value }) => (
    <Paper
        variant="outlined"
        sx={{ flex: 1, minWidth: 150, p: 2, textAlign: 'center', borderRadius: 2 }}
    >
        <Box component="span" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>{label}</Box>
        <Box component="div" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</Box>
    </Paper>
);

const ChartBox = ({ title, children }) => (
    <Paper
        variant="outlined"
        sx={{ flex: 1, minWidth: 300, p: 2, borderRadius: 2 }}
    >
        <Box component="h3" sx={{ fontSize: '1rem', textAlign: 'center', mb: 1 }}>{title}</Box>
        {children}
    </Paper>
);
