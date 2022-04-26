import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AddCharity from "./AddCharity";
import Charity from "./Charity";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";

import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getCharities as getCharityList,
  donateToCharity,
  createCharity,
} from "../../utils/donations";

const Charities = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(false);

  // function to get the list of charity projects
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

  const addCharity = async (data) => {
    try {
      setLoading(true);
      createCharity(data).then((resp) => {
        getCharities();
      });
      toast(<NotificationSuccess text="Charity Project created successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a charity project." />);
    } finally {
      setLoading(false);
    }
  };

 

  //  function to initiate transaction
  const donate = async (id, price) => {
    try {
      await donateToCharity({
        id,
        price,
      }).then((resp) => getCharities());
      toast(<NotificationSuccess text="Donation successfully made to Charity Project." />);
    } catch (error) {
      toast(<NotificationError text="Failed to make donation." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCharities();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Near Charity(Donations)</h1>
            <AddCharity save={addCharity} />
            
          </div>
          <Row xs={1} sm={2} lg={2} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {charities.map((_charity) => (
              <Charity
                charity={{
                  ..._charity,
                }}
                donate={donate}
              />
            ))}
          </Row>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Charities;