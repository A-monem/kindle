import React from 'react'
import {
  TableContainer, Table, TableHead, TableBody, TableCell, IconButton, TableRow, Paper, Tooltip,
} from '@material-ui/core'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import PropTypes from 'prop-types'
import { keyIdGenerator } from '../../../api/RandomId'

function TableTemplate({ titleList, dataList, deleteMethod }) {
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Qualification</TableCell>
            <TableCell>Year</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {dataList.map((row) => (
            <TableRow key={keyIdGenerator()}>
              <TableCell component="th" scope="row">
                {row.qualification}
              </TableCell>
              <TableCell>{row.year}</TableCell>
              <TableCell align="right">
                <Tooltip title="remove">
                  <IconButton onClick={() => deleteMethod(row)}>
                    <DeleteForeverIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

TableTemplate.propTypes = {
  titleList: PropTypes.array.isRequired,
  dataList: PropTypes.array.isRequired,
  deleteMethod: PropTypes.func.isRequired,
}

export default TableTemplate
