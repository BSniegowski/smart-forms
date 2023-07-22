import * as Yup from 'yup';
import {ObjectShape} from "yup";

export const generateValidationSchema = (formSchema: any) => {
  const validationSchema: object = {};

  const fields = formSchema.properties

  for (const fieldName of Object.keys(fields)) {
    let fieldValidator: any = Yup;
    const fieldProps = fields[fieldName]
    switch(fieldProps.type) {
      case 'string':
        fieldValidator = Yup.string();
        if(fieldProps.format == 'email')
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

    if(formSchema.required.includes(fieldName))
      fieldValidator = fieldValidator.required(`${fieldName} is required`)

    // @ts-ignore
    validationSchema[fieldName] = fieldValidator;
  }


  return Yup.object().shape(<ObjectShape>validationSchema);
};