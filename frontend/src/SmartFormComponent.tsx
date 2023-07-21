import {Alert, Button, Dialog, DialogContent, DialogTitle, TextField} from "@mui/material";
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
  editId?: bigint
}

export const SmartFormComponent: React.FC<SmartFormComponentProps> =
  (props: SmartFormComponentProps) => {
    const [schema, setSchema] = useState<object>({})
    const [loading, setLoading] = useState<boolean>(true)
    const [initialValues, setInitialValues] = useState<FormikValues>({})
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [backendResponse, setBackendResponse] = useState<string>('')

    const schemaUrl: string = `${BACKEND_BASE_URL}/${props.topic}/schema/${props.formType}`
    const getEditDataUrl: string = `${BACKEND_BASE_URL}/${props.topic}/get?id=${props.editId}`
    const createUrl: string = `${BACKEND_BASE_URL}/${props.topic}/create`
    const updateUrl: string = `${BACKEND_BASE_URL}/${props.topic}/update?machine_id=${props.editId}`

    useEffect(() => {
      fetch(schemaUrl)
        .then(response => response.json())
        .then(data => {
          console.log("schema", data)
          setSchema(data)
          if (props.formType == "update") {
            fetch(getEditDataUrl)
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
    const handleSubmit = (values: FormikValues) => {
      setSubmitting(true);
      console.log("values", values);

      let url, httpMethod: string
      if (props.formType == 'create') {
        url = createUrl
        httpMethod = 'POST'
      } else {
        url = updateUrl
        httpMethod = 'PUT'
      }
      fetch(url, {
        method: httpMethod,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }).then(response => response.json())
        .then(data => {
          console.log("response data", data)
          setBackendResponse(JSON.stringify(data))
          setTimeout(() => setBackendResponse(''), 10000)
        })
        .catch(error => {
          setBackendResponse(JSON.stringify(error.json()))
          setTimeout(() => setBackendResponse(''), 10000)
        })

      setSubmitting(false);
    };

    if (loading) return <LinearProgress/>

    // @ts-ignore
    return !schema ? (<div>Error: fetched empty schema</div>) : (
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
                  return <Field
                    as={TextField}
                    key={prop}
                    name={prop}
                    type={property.type ?? "text"}
                    label={property.title}
                    variant="outlined"
                    style={{margin: '10px'}}
                  />
                })
              }
              <Button onClick={props.onClose}>Cancel</Button>
              <Button type="submit" variant="contained">Submit</Button>
            </Form>
          </Formik>
          {submitting ? <LinearProgress/> : null}
          {backendResponse ? <Alert severity="info">{backendResponse}</Alert> : null}
        </DialogContent>
      </Dialog>
    )
  }
