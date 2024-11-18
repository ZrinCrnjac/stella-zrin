import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './index';
import './Admin.css';

function Admin() {
  const [rsvps, setRsvps] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust items per page as needed

  useEffect(() => {
    const fetchRsvps = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "guests"));
        const rsvpList = querySnapshot.docs.map(doc => doc.data());

        // Sort RSVPs by lastName (and firstName as a tiebreaker)
        const sortedRsvpList = rsvpList.sort((a, b) => {
          const lastNameA = a.lastName?.toLowerCase() || '';
          const lastNameB = b.lastName?.toLowerCase() || '';
          const firstNameA = a.firstName?.toLowerCase() || '';
          const firstNameB = b.firstName?.toLowerCase() || '';

          if (lastNameA < lastNameB) return -1;
          if (lastNameA > lastNameB) return 1;
          if (firstNameA < firstNameB) return -1;
          if (firstNameA > firstNameB) return 1;
          return 0;
        });

        setRsvps(sortedRsvpList);
      } catch (error) {
        console.error("Error fetching RSVPs:", error);
      }
    };

    fetchRsvps();
  }, []);

  // Calculate indices for paginated data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRsvps = rsvps.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(rsvps.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="admin-container">
      <h1>RSVP Responses</h1>
      <p>Total Count: {rsvps.length}</p>
      <div className="rsvp-list">
        {currentRsvps.length > 0 ? (
          currentRsvps.map((rsvp, index) => (
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
      <div className="pagination">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export { Admin };
