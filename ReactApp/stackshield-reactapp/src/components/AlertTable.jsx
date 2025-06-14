import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tooltip
} from '@mui/material';
import { format } from 'date-fns';
import SeverityPill from './SeverityPill';
import * as XLSX from 'xlsx';

// Intl API for country names
const regionNames = typeof Intl !== 'undefined' && Intl.DisplayNames
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null;

export default function AlertTable({ alerts }) {
  const handleDownloadExcel = () => {
    const worksheetData = alerts.map(item => {
      const { alert, log } = item;
      const id = alert.id || log.eventID;
      const hostIp = alert.hostIp || log.sourceIPAddress || 'N/A';
      const hostName = alert.hostName || log.hostName || 'N/A';

      // derive country code and name
      const matchCode = hostName.match(/host-([a-z]{2})-/i);
      const rawCode = matchCode ? matchCode[1].toLowerCase() : '';
      const isoCode = rawCode === 'uk' ? 'gb' : rawCode;
      const countryName = regionNames && isoCode
          ? regionNames.of(isoCode.toUpperCase())
          : '';

      return {
        'Host IP Address': hostIp,
        'Host Name': hostName,
        'Country': countryName,
        'Alert ID': id,
        Service: alert.service,
        Resource: alert.resource,
        Time: format(new Date(log.eventTime), 'yyyy-MM-dd HH:mm:ss'),
        Severity: alert.severity,
        Description: alert.description,
        Recommendation: alert.recommendation,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Alerts');
    XLSX.writeFile(workbook, 'alerts_report.xlsx');
  };

  // Helper: render flag image from flagcdn
  const renderFlag = isoCode => {
    if (!isoCode) return null;
    const code = isoCode.toLowerCase();
    const src = `https://flagcdn.com/24x18/${code}.png`;
    return (
        <img
            src={src}
            alt={code}
            width={24}
            height={18}
            style={{ display: 'inline-block', verticalAlign: 'middle' }}
            onError={e => { e.currentTarget.style.display = 'none'; }}
        />
    );
  };

  return (
      <>
        <Button
            variant="contained"
            color="secondary"
            sx={{ mb: 2 }}
            onClick={handleDownloadExcel}
        >
          Download Excel
        </Button>

        <TableContainer component={Paper}>
          <Table
              sx={{
                borderCollapse: 'collapse',
                '& th, & td': {
                  border: '2px solid',
                  borderColor: 'divider'
                }
              }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>Host IP Address</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>Host Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>Alert ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>Service</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>Resource</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>Time</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>Severity</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>Recommendation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.map(item => {
                const { alert, log } = item;
                const id = alert.id || log.eventID;
                const hostIp = alert.hostIp || log.sourceIPAddress || 'N/A';
                const hostName = alert.hostName || log.hostName || 'N/A';
                const time = format(new Date(log.eventTime), 'yyyy-MM-dd HH:mm:ss');

                // derive country code
                const match = hostName.match(/host-([a-z]{2})-/i);
                const rawCode = match ? match[1].toLowerCase() : '';
                const isoCode = rawCode === 'uk' ? 'gb' : rawCode;
                const countryName = regionNames && isoCode
                    ? regionNames.of(isoCode.toUpperCase())
                    : '';

                return (
                    <TableRow key={id}>
                      <TableCell>
                        <Tooltip title={countryName || 'Unknown'}>
                      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                        {renderFlag(isoCode)}
                        <span style={{ marginLeft: 6 }}>{hostIp}</span>
                      </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{hostName}</TableCell>
                      <TableCell>{id}</TableCell>
                      <TableCell>{alert.service}</TableCell>
                      <TableCell>{alert.resource}</TableCell>
                      <TableCell>{time}</TableCell>
                      <TableCell><SeverityPill severity={alert.severity} /></TableCell>
                      <TableCell>{alert.description}</TableCell>
                      <TableCell>{alert.recommendation}</TableCell>
                    </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </>
  );
}
