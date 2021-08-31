import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

import '../styles/CalendarSettingsItem.css';

const CalendarSettingsItem = (props) => {
  const error = props.error;

  return (
    <div className='CalendarSettingsItem'>
      <Container>
        <Row>
          <Col xs={12} md={6} >
            <Form.Label htmlFor={props.id}>{props.label}</Form.Label>
          </Col>
        </Row>

        <Row className='twoColumn'>
          <Col xs={12} md={6} >
            <Form.Group controlId={props.id}>
              <Form.Control
                name={props.id}
                type={props.type}
                value={props.value}
                onChange={event => props.onChange(event)}
                onBlur={event => props.onBlur(event)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6} >
            <div className='btnGroup'>
              {!props.editMode &&
                <Button
                  type='button'
                  name='editBtn'
                  variant='primary'
                  onClick={() => props.onEdit(props.id)} >
                  Edit
                </Button>
              }
              {props.editMode &&
                <Button
                  type='submit'
                  name='saveBtn'
                  variant='success'
                  onClick={event => props.onSubmit(event)} >
                  Save
                </Button>
              }
              {props.editMode && props.id !== 'add-calendar' &&
                <Button
                  type='button'
                  name='cancelBtn'
                  variant='secondary'
                  onClick={() => props.onCancel(props.id)} >
                  Cancel
                </Button>
              }
            </div>
          </Col>
        </Row>

        {error &&
          <Row>
            <Col>
              <div className='error text-danger'>
                <small>{error}</small>
              </div>
            </Col>

          </Row>
        }
      </Container>
    </div>
  )
}


export default CalendarSettingsItem;