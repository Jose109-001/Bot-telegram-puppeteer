import React from 'react';

// Table component
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core';

import useStyles from './styles';

// Icons
import PeopleIcon from '@material-ui/icons/People';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';

const createData = (name, value) => ({ name, value });

export default function ResourcesTable({ data }) {
  const classes = useStyles();

  const rows = [
      createData('Population', data.population),
      createData('Gold', data.gold),
      createData('Wood', data.wood),
      createData('Wine', data.wine),
      createData('Marble', data.marble),
      createData('Crystal', data.crystal),
      createData('Sulfur', data.sulfur),
  ];

  const Icon = ({ type }) => {
    switch (type) {
      case 'Population':
        return <PeopleIcon />;
      
      case 'Gold':
        return <AccountBalanceIcon />;

      default:
        return <ViewComfyIcon />;
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.resourcesTable} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Resource</TableCell>
            <TableCell align="right">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                <Box display="flex" alignItems="center">
                  <Icon type={row.name} />
                  {row.name}
                </Box>
              </TableCell>
              <TableCell align="right">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}