import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { utils } from "near-api-js";
import MakeDonation from "./MakeDonation";
import { Card, Button, Col, Badge, Stack } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getCharities as getCharityList,
  donateToCharity,
  createCharity,
} from "../../utils/donations";

const Charity = ({ charity }) => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(false);


  const getCharities = useCallback(async () => {
    try {
      setLoading(true);
      setCharities(await getCharityList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const { id, goal, name, purpose, raised, location, image, owner, donations, highest, donors } =
    charity;


  const makeDonation = async (data) => {
    console.log(data.id, data.amount);
    try {
      setLoading(true);
      await donateToCharity({
        id: data.id,
        donation: data.donation,

      }).then((resp) => getCharities());
      toast(<NotificationSuccess text="Charity Project created successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a charity project." />);
    } finally {
      setLoading(false);
    }
  };

  const donate = async (id, amount) => {
    try {
      await donateToCharity({
        id,
        amount,
      }).then((resp) => getCharities());
      toast(<NotificationSuccess text="Meal successfully purchased" />);
    } catch (error) {
      toast(<NotificationError text="Failed to purchase product." />);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <span className="font-monospace text-secondary">{owner}</span>
            <Badge bg="secondary" className="ms-auto">
              Goal: {utils.format.formatNearAmount(goal)} Near | Raised: {utils.format.formatNearAmount(raised)} Near
            </Badge>
          </Stack>
        </Card.Header>
        <div className=" ratio ratio-4x3">
          <img src={image} alt={name} style={{ objectFit: "cover" }} />
        </div>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{donations} Donation(s) | Highest Donation: {utils.format.formatNearAmount(highest)} Near</Card.Subtitle>
          <Card.Text>Last Donor: {donors[donors.length - 1]}</Card.Text>
          <Card.Text className="flex-grow-1 ">{purpose}</Card.Text>
          <Card.Text className="text-secondary">
            <span>{location}</span>
          </Card.Text>
          <Button
            variant="outline-dark"
            className="w-100 py-3"
          >
            Make Donation <MakeDonation save={makeDonation} id={id}/>
          </Button>
          
        </Card.Body>
      </Card>
    </Col>
  );
};

Charity.propTypes = {
  charity: PropTypes.instanceOf(Object).isRequired,
  buy: PropTypes.func.isRequired,
};

export default Charity;