import React,{useState,useEffect} from 'react';
import './SubscriptionsView.css';
import axios from 'axios';
import { FaSyncAlt } from "react-icons/fa";


function SubscriptionsView() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);

  const api = "http://localhost:3001";

  useEffect(() => {
    axios
      .get(`${api}/getAllSubscriptions`)
      .then((response) => {
        setSubscriptions(response.data.subscriptions);
      })
      .catch((error) => {
        console.error("Error fetching organizations:", error);
        setSubscriptions([]);
      });
  }, []);

  const openModal = () => {
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  const renewSubscription = (subscriptionId) => {
    axios
      .put(`${api}/updateSubscriptionStatusToVerified/${subscriptionId}`)
      .then((response) => {
        if (response.status === 200) {
          window.location.reload()
        } else {
          // Handle other status codes or error responses
        }
      })
      .catch((error) => {
        console.error("Error renewing subscription:", error);
        // Handle the error, e.g., show an error message to the user
      });
  };

  return (
    <>
    
    <div className='SubscriptionsView-container'>
      <table className='SubscriptionsView-container-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((subscription) => (
            <tr key={subscription._id}>
              <td>{subscription.name}</td>
              <td>{subscription.email}</td>
              <td>{subscription.location}</td>
              <td style={{ color: subscription.status === "verified" ? "green" : "red" }}>
                {subscription.status}
                {subscription.status === 'expired' && <FaSyncAlt onClick={() => {
                    setSelectedSubscriptionId(subscription._id);
                    openModal();
                  }} className='renew-icon' title="Renew Subscription" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>


    {showModal && (
        <div className="modal">
          <span className="close" title="Close Modal" onClick={closeModal}>
            x
          </span>
          <form className="modal-content">
            <div className="container">
              <h1>Renew Subscription</h1>
              <p>Are you sure you want to Renew this Susbcription?</p>

              <div className="clearfix">
                <button type="button" className="cancelbtn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="button" className="acceptbtn"   onClick={() => {
        if (selectedSubscriptionId) {
          renewSubscription(selectedSubscriptionId);
        }
        closeModal();
      }}>
                  Accept
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default SubscriptionsView