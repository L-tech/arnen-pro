import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const MakeDonation = ({ save, id }) => {
  const [donation, setDonation] = useState(0);
  const min = 10000000000000000000000;

  const isFormFilled = () =>  Number(donation) > min;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="rounded-pill px-0"
        style={{ width: "38px" }}
      >
        <i class="bi bi-plus"></i>
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Donate to Charity Project</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            
            <FloatingLabel
              controlId="inputDonation"
              label="Donation"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Donation(Min 0.1 Near)"
                onChange={(e) => {
                  setDonation(e.target.value);
                }}
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                id,
                donation,
              });
              handleClose();
            }}
          >
            Donate to Charity
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

MakeDonation.propTypes = {
  save: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default MakeDonation;