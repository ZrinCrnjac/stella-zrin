import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from './index';
import { collection, addDoc, getDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isComing, setIsComing] = useState('');
  const [message, setMessage] = useState('');

  const [docData, setDocData] = useState(null); // For fetched document data
  const [loading, setLoading] = useState(true); // For loading state
  // Fetch document data when component mounts
  useEffect(() => {
    async function fetchDocument() {
      const docRef = doc(db, 'stella-zrin', 'k40cWfTAySWWaE2y2ffu');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDocData(docSnap.data());
      } else {
        console.log("No such document!");
      }
      setLoading(false);
    }

    fetchDocument();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (firstName && lastName && isComing) {
      try {
        await addDoc(collection(db, "guests"), {
          firstName,
          lastName,
          isComing: isComing === 'yes',
        });
        setMessage('RSVP submitted! Thank you!');
        setFirstName('');
        setLastName('');
        setIsComing('');
      } catch (error) {
        setMessage('Error submitting RSVP. Please try again.');
      }
    } else {
      setMessage('Please complete the form.');
    }
  };

  return (
    <div>
      <h1>Wedding RSVP</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <select
          value={isComing}
          onChange={(e) => setIsComing(e.target.value)}
        >
          <option value="">Will you attend?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;