import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './index';
import './Admin.css';

function Admin() {
  const [rsvps, setRsvps] = useState([]);

  useEffect(() => {
    const fetchRsvps = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "guests"));
        const rsvpList = querySnapshot.docs.map(doc => doc.data());
        setRsvps(rsvpList);
      } catch (error) {
        console.error("Error fetching RSVPs:", error);
      }
    };

    fetchRsvps();
  }, []);

  return (
    <div className="admin-container">
      <h1>RSVP Responses</h1>
      <div className="rsvp-list">
        {rsvps.length > 0 ? (
          rsvps.map((rsvp, index) => (
            <div key={index} className="rsvp-item">
              <div className="rsvp-row">
                <p><strong>Name:</strong> {rsvp.firstName} {rsvp.lastName} 
                    <span className={rsvp.isComing ? 'checkmark' : 'cross'}>
                        {rsvp.isComing ? '✔' : '✖'}
                    </span>
                </p>
              </div>
              {rsvp.isComing && rsvp.guestFirstName && rsvp.guestLastName && (
                <p><strong>Guest:</strong> {rsvp.guestFirstName} {rsvp.guestLastName}</p>
              )}
            </div>
          ))
        ) : (
          <p>No RSVPs yet.</p>
        )}
      </div>
    </div>
  );
}

export default Admin;
