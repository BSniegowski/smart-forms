import {Alert, Button, Dialog, DialogContent, DialogTitle, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {BACKEND_BASE_URL} from "./config.ts";
import LinearProgress from "@mui/material/LinearProgress";
import {Formik, Form, Field, FormikValues, ErrorMessage} from 'formik';
import {generateValidationSchema} from "./utils.ts";

interface SmartFormComponentProps {
  open: boolean
  topic: string
  formType: string
  rawData?: any
  onClose: any
  updateId?: bigint
}

export const SmartFormComponent: React.FC<SmartFormComponentProps> =
  (props: SmartFormComponentProps) => {
    const [schema, setSchema] = useState<object>({})
    const [loading, setLoading] = useState<boolean>(true)
    const [initialValues, setInitialValues] = useState<FormikValues>({})
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [feedback, setFeedback] = useState<string>('')

    const schemaUrl: string = `${BACKEND_BASE_URL}/${props.topic}/schema/${props.formType}`
    const getUpdateDataUrl: string = `${BACKEND_BASE_URL}/${props.topic}/get?id=${props.updateId}`

    let submitUrl: string = `${BACKEND_BASE_URL}/${props.topic}/${props.formType}`
    if (props.formType == 'update')
      submitUrl += `?machine_id=${props.updateId}`
    const httpMethod: string = props.formType == 'create' ? 'POST' : 'PUT'

    useEffect(() => {
      fetch(schemaUrl)
        .then(response => response.json())
        .then(data => {
          console.log("schema", data)
          setSchema(data)
          if (props.formType == "update") {
            // fetch the data to be updated
            fetch(getUpdateDataUrl)
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

    const handleSubmit = (values: FormikValues) => {
      setSubmitting(true);
      console.log("values", values);

      fetch(submitUrl, {
        method: httpMethod,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }).then(response => response.json())
        .then(data => {
          console.log("response data", data)
          setFeedback(JSON.stringify(data.detail))
          setTimeout(() => setFeedback(''), 10000)
        })
        .catch(error => {
          setFeedback(JSON.stringify(error.json()))
          setTimeout(() => setFeedback(''), 10000)
        })

      setSubmitting(false);
    };

    if (loading) return <LinearProgress/>


    // @ts-ignore
    return !schema ? (<div>Error: fetched empty schema</div>) : (
      <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle>Form type: {props.formType}</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={generateValidationSchema(schema)}
          >
            <Form>
              {
                // @ts-ignore
                Object.keys(schema.properties).map((prop: string) => {
                  // @ts-ignore
                  let property = schema.properties[prop]
                  return <div>
                    <ErrorMessage
                      name={prop}
                      render={(msg: string) => <Alert severity="error">{msg}</Alert> }
                    />
                    <Field
                      as={TextField}
                      key={prop}
                      name={prop}
                      type={property.type ?? "text"}
                      label={property.title}
                      variant="outlined"
                      style={{margin: '10px'}}
                    />
                  </div>
                })
              }
              <Button onClick={props.onClose}>Cancel</Button>
              <Button type="submit" variant="contained">Submit</Button>
            </Form>
          </Formik>
          {submitting ? <LinearProgress/> : null}
          {feedback ? <Alert severity="info">{feedback}</Alert> : null}
        </DialogContent>
      </Dialog>
    )
  }
