import './App.css'
import {useEffect, useState} from "react";
import {BACKEND_BASE_URL} from "./config.ts";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton'
import {SmartFormComponent} from "./SmartFormComponent.tsx";
import {StyledTableCell, StyledTableRow} from "./utils.ts";


function DataTable(props: { dataType: string }) {
  const [loading, setLoading] = useState<boolean>(true)
  const [tableData, setTableData] = useState<object[]>([{}])
  const [editId, setEditId] = useState<bigint>()
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [formType, setFormType] = useState<string>('')
  const [rawData, setRawData] = useState()

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/${props.dataType}/get`)
      .then(response => response.json())
      .then(data => {
        setTableData(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error:', error)
        setLoading(false)
      });
  }, []);


  const handleClickAdd = () => {
    setFormType('create')
    setDialogOpen(true)
  }
  const handleClickEdit = async (id: bigint) => {
    const getUpdateDataUrl: string = `${BACKEND_BASE_URL}/${props.dataType}/get?id=${id}`
    const updateResponse = await fetch(getUpdateDataUrl);
    const dataToUpdate = await updateResponse.json();
    setRawData(dataToUpdate[0])
    setEditId(id)
    setFormType('update')
    setDialogOpen(true)
  }

  if (loading) return (<LinearProgress/>)

  const AddInstanceButton = () => (<IconButton onClick={handleClickAdd}>
    <AddIcon/>
  </IconButton>)

  return !tableData ? (<AddInstanceButton/>) : (
    <div>
      {!dialogOpen ? null :
        <SmartFormComponent
          updateId={editId}
          open={dialogOpen}
          formType={formType}
          topic={props.dataType}
          onClose={() => setDialogOpen(false)}
          rawData={rawData}
        />}
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 700}} aria-label="customized table">
          <TableHead>
            <TableRow>
              {/*using first row to determine attributes*/}
              {Object.keys(tableData[0] ?? {}).map((attribute: string) =>
                <StyledTableCell key={attribute}>{attribute}</StyledTableCell>)}
              <StyledTableCell>Edit</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => {
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
