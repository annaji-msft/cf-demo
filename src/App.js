import styles from "./App.module.css";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [subject, setSubject] = useState("");
  const [comment, setComment] = useState("");
  const [priority, setPriority] = useState("");

  const [ticketId, setTicketId] = useState("");
  const [messageId, setMessageId] = useState("");
  const [paymentId, setPaymentId] = useState("");

  const [loaded, setLoaded] = useState(true);
  const [success, setSuccess] = useState(false);
  const [paymentLoaded, setPaymentLoaded] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoaded(false);
      setSuccess(false);
      await axios
        .post("/api/createTicket", {
          subject: subject,
          comment: comment,
          priority: priority.toLowerCase(),
        })
        .then((response) => {
          setTicketId(response.data.id);
          setMessageId(response.data.mid);
          setLoaded(true);
          setSuccess(true);
        });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      setPaymentLoaded(false);
      setPaymentSuccess(false);
      await axios
        .post("/api/makePayment", {
          messageId: messageId,
          ticketId: ticketId,
        })
        .then((response) => {
          setPaymentId(response.data.paymentId);
          setPaymentLoaded(true);
          setPaymentSuccess(true);
        });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container
      style={{
        backgroundColor: "#EEE9E9	",
        height: "100vh",
      }}
      fluid
    >
      <Row>
        <Col className={styles.edge}></Col>
        <Col xs={6} className={styles.middle}>
          <h1> Create Zendesk Ticket </h1>
          <Form className={styles.form}>
            <Form.Group xs={2} className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Enter subject"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                onChange={(event) => setComment(event.target.value)}
                placeholder="Enter comment"
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                onChange={(event) => {
                  setPriority(event.target.value);
                }}
              >
                <option>Select Priority </option>
                <option>Urgent</option>
                <option>High</option>
                <option>Normal</option>
                <option>Low</option>
              </Form.Select>
            </Form.Group>
          </Form>
          {loaded ? (
            <Button
              className="mb-3"
              onClick={(e) => handleSubmit(e)}
              variant="primary"
            >
              Submit
            </Button>
          ) : (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}

          {success ? (
            <>
              <p style={{ color: "green" }}>
                {" "}
                Successfully created Zendesk ticket and sent message to Teams!
              </p>
              <p> Ticket ID: {ticketId}</p>
              <h6> To resolve this ticket, please pay $20 to the admin </h6>

              {paymentLoaded ? (
                <Button
                  onClick={(e) => handlePayment(e)}
                  variant="success"
                  className="mt-3 mb-3"
                >
                  {" "}
                  Pay with Stripe
                </Button>
              ) : (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
              {paymentSuccess ? (
                <>
                  <p style={{ color: "green" }}>
                    {" "}
                    Successfully created Payment Intent!
                  </p>
                  <p> Payment Intent ID: {paymentId}</p>
                </>
              ) : null}
            </>
          ) : null}
        </Col>
        <Col className={styles.edge}></Col>
      </Row>
    </Container>
  );
}

export default App;
