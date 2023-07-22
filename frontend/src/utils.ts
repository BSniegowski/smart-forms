import * as Yup from 'yup';
import {ObjectShape} from "yup";
import {styled} from "@mui/material/styles";
import TableCell, {tableCellClasses} from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

export const generateValidationSchema = (formSchema: any) => {
  const validationSchema: object = {};

  const fields = formSchema.properties

  for (const fieldName of Object.keys(fields)) {
    let fieldValidator: any = Yup;
    const fieldProps = fields[fieldName]
    switch (fieldProps.type) {
      case 'string':
        fieldValidator = Yup.string();
        if (fieldProps.format == 'email')
          fieldValidator = fieldValidator.email();
        break;
      case 'number':
        fieldValidator = Yup.number();
        break;
      case 'integer':
        fieldValidator = Yup.number().integer();
        break;
      default:
        fieldValidator = Yup.mixed();
    }

    if (formSchema.required.includes(fieldName))
      fieldValidator = fieldValidator.required(`${fieldName} is required`)

    // @ts-ignore
    validationSchema[fieldName] = fieldValidator;
  }


  return Yup.object().shape(<ObjectShape>validationSchema);
};

export const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const StyledTableRow = styled(TableRow)(({theme}) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));