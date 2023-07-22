import {Alert, AlertColor, Button, Dialog, DialogContent, DialogTitle, TextField} from "@mui/material";
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
    const {open, topic, formType, onClose, updateId, rawData} = props;
    const [schema, setSchema] = useState<object>({})
    const [loading, setLoading] = useState<boolean>(true)
    const [initialValues, setInitialValues] = useState<FormikValues>({})
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [feedback, setFeedback] = useState<string>('')
    const [feedbackSeverity, setFeedbackSeverity] = useState<AlertColor>('info')

    const schemaUrl: string = `${BACKEND_BASE_URL}/${topic}/schema/${formType}`

    let submitUrl: string = `${BACKEND_BASE_URL}/${topic}/${formType}`
    if (formType == 'update')
      // to allow greater flexibility it would be better to
      // change API specification to accept 'id' instead of 'machine_id'
      submitUrl += `?machine_id=${updateId}`
    const httpMethod: string = formType == 'create' ? 'POST' : 'PUT'


    const fetchSchema = async () => {
      try {
        const response = await fetch(schemaUrl);
        const data = await response.json();
        setSchema(data);

        let defaultValues: any = {}
        for (const prop in data.properties) {
          defaultValues[prop] = data.properties[prop].default ?? null
        }
        setInitialValues(defaultValues)
        if (formType === "update") {
          // update defaultValues with rawData
          Object.entries(rawData).forEach(([key, value]) => {
            if (key in defaultValues) defaultValues[key] = value;
          });
          setInitialValues(defaultValues);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchSchema();
    }, []);

    const handleSubmit = async (values: FormikValues) => {
      setSubmitting(true);

      try {
        const response = await fetch(submitUrl, {
          method: httpMethod,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (response.ok) setFeedbackSeverity('success')
        else setFeedbackSeverity('error')
        const data = await response.json();
        setFeedback(data.message ?? JSON.stringify(data));
        setTimeout(() => setFeedback(''), 10000);
      } catch (error) {
        setFeedback(JSON.stringify(error));
        setFeedbackSeverity('error')
        setTimeout(() => setFeedback(''), 10000);
      }

      setSubmitting(false);
    };

    if (loading) return <LinearProgress/>


    return !schema ? (<Alert severity="error">Error fetching form schema</Alert>) : (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Form type: {formType}</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={generateValidationSchema(schema)}
            enableReinitialize={false}
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
                      render={(msg: string) => <Alert severity="error">{msg}</Alert>}
                    />
                    <Field
                      as={TextField}
                      key={prop}
                      name={prop}
                      disabled={property.read_only ?? false}
                      type={property.type ?? "text"}
                      label={property.title}
                      variant="outlined"
                      style={{margin: '10px'}}

                    />
                  </div>
                })
              }
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained">Submit</Button>
            </Form>
          </Formik>
          {submitting ? <LinearProgress/> : null}
          {feedback ? <Alert severity={feedbackSeverity}>{feedback}</Alert> : null}
        </DialogContent>
      </Dialog>
    )
  }
