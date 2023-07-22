import './App.css'
import {useEffect, useState} from "react";
import {BACKEND_BASE_URL} from "./config.ts";
import {styled} from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton'
import {SmartFormComponent} from "./SmartFormComponent.tsx";

const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function DataTable(props: { dataType: string }) {
  const [loading, setLoading] = useState<boolean>(true)
  const [responseData, setResponseData] = useState<object[]>([{}])
  const [editId, setEditId] = useState<bigint>()

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/${props.dataType}/get`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setResponseData(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error:', error)
        setLoading(false)
      });
  }, []);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [formType, setFormType] = useState<string>('')
  const handleClickAdd = () => {
    setFormType('create')
    setDialogOpen(true)
  }
  const handleClickEdit = (id: bigint) => {
    setEditId(id)
    setFormType('update')
    setDialogOpen(true)
  }

  if (loading) return (<LinearProgress/>)

  const AddInstanceButton = () => (<IconButton onClick={handleClickAdd}>
    <AddIcon/>
  </IconButton>)

  return !responseData ? (<AddInstanceButton/>) : (
    <div>
      {!dialogOpen ? null : <SmartFormComponent
        updateId={editId} open={dialogOpen} formType={formType} topic={props.dataType} onClose={() => setDialogOpen(false)}
      />}
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 700}} aria-label="customized table">
          <TableHead>
            <TableRow>
              {/*using first row to determine attributes*/}
              {Object.keys(responseData[0]).map((attribute: string) => <StyledTableCell key={attribute}>{attribute}</StyledTableCell>)}
              <StyledTableCell>Edit</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {responseData.map((row) => {
              return (
                <StyledTableRow>
                  {Object.values(row).map((value: string | number) => <StyledTableCell>{value}</StyledTableCell>)}
                  <StyledTableCell>
                    {/*@ts-ignore*/}
                    <IconButton onClick={() => handleClickEdit(row.id as bigint)}>
                      <EditIcon/>
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              )
            })}
            <StyledTableCell>
              <AddInstanceButton/>
            </StyledTableCell>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default DataTable
