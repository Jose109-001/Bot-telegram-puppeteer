import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

// Table component
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

// Icons
import PeopleIcon from '@material-ui/icons/People';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

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
      <Table className={classes.table} aria-label="simple table">
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
                <Icon type={row.name} />
                {row.name}
              </TableCell>
              <TableCell align="right">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}