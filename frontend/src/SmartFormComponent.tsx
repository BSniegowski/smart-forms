import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {BACKEND_BASE_URL} from "./config.ts";
import LinearProgress from "@mui/material/LinearProgress";
import {Formik, Form, Field, ErrorMessage, FormikConfig, FormikValues} from 'formik';

interface SmartFormComponentProps {
  open: boolean
  topic: string
  formType: string
  rawData?: any
  onClose: any
  id?: number
}

export const SmartFormComponent: React.FC<SmartFormComponentProps> =
  (props: SmartFormComponentProps) => {
    const [schema, setSchema] = useState<object>({})
    const [loading, setLoading] = useState<boolean>(true)
    const [initialValues, setInitialValues] = useState<FormikValues>({})

    useEffect(() => {
      fetch(`${BACKEND_BASE_URL}/${props.topic}/schema/${props.formType}`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          setSchema(data)
          setLoading(false)
        })
        .catch(error => {
          console.error('Error:', error)
          setLoading(false)
        });
    }, []);

    // Form submission handler
    const handleSubmit = (values: any) => {
      console.log(values);
    };

    if (loading) return <LinearProgress/>

    return !schema ? (<div>Error: fetched empty schema for chosen action</div>) : (
      <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle>Form type: {props.formType}</DialogTitle>
        <DialogContent>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            <Form>
              {Object.keys(schema.properties).map((prop: string) => {
                let property = schema.properties[prop]
                return <Field
                  as={TextField}
                  key={property.title}
                  type={property.type ?? "text"}
                  label={property.title}
                  variant="outlined"
                  style={{margin: '10px'}}
                />
              })}
            </Form>
          </Formik>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    )
  }
