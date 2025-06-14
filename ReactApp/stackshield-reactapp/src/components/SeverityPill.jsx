import React from 'react';
import { Chip } from '@mui/material';

const colors = {
  Critical: 'error',
  High: 'warning',
  Medium: 'info',
  Low: 'success'
};

export default function SeverityPill({ severity }) {
  return <Chip label={severity} color={colors[severity] || 'default'} />;
}
