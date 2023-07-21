import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {BACKEND_BASE_URL} from "./config.ts";
import LinearProgress from "@mui/material/LinearProgress";
import {Formik, Form, Field, FormikValues} from 'formik';

interface SmartFormComponentProps {
  open: boolean
  topic: string
  formType: string
  rawData?: any
  onClose: any
  editId?: number
}

export const SmartFormComponent: React.FC<SmartFormComponentProps> =
  (props: SmartFormComponentProps) => {
    const [schema, setSchema] = useState<object>({})
    const [loading, setLoading] = useState<boolean>(true)
    const [initialValues, setInitialValues] = useState({})

    const schemaUrl: string = `${BACKEND_BASE_URL}/${props.topic}/schema/${props.formType}`
    const editDataUrl: string = `${BACKEND_BASE_URL}/${props.topic}/get?id=${props.editId}`

    useEffect(() => {
      fetch(schemaUrl)
        .then(response => response.json())
        .then(data => {
          console.log("schema", data)
          setSchema(data)
          if (props.formType == "update") {
            fetch(editDataUrl)
              .then(response => response.json())
              .then(data => {
                console.log("editData[0]", data[0])
                setInitialValues(data[0])
                setLoading(false)
              })
              .catch(error => {
                console.error('Error:', error)
                setLoading(false)
              })
          } else setLoading(false)
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

    // @ts-ignore
    return !schema ? (<div>Error: fetched empty schema for chosen action</div>) : (
      <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle>Form type: {props.formType}</DialogTitle>
        <DialogContent>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            <Form>
              {
                // @ts-ignore
                Object.keys(schema.properties).map((prop: string) => {
                  // @ts-ignore
                  let property = schema.properties[prop]
                  console.log(property.title)
                  return <Field
                    as={TextField}
                    name={prop}
                    type={property.type ?? "text"}
                    label={property.title}
                    variant="outlined"
                    style={{margin: '10px'}}
                  />
                })
              }
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
