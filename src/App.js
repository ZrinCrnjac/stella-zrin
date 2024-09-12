import React, { useState } from 'react';
import './App.css';

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isComing, setIsComing] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (firstName && lastName && isComing) {
      // You will handle Firebase here
      setMessage('RSVP submitted! Thank you!');
      setFirstName('');
      setLastName('');
      setIsComing('');
    } else {
      setMessage('Please complete the form.');
    }
  };

  return (
    <div className="container">
      <h1>You're Invited to Our Wedding!</h1>
      <p>We would love for you to join us on our special day. Please confirm your attendance below:</p>

      <form onSubmit={handleSubmit} className="rsvp-form">
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Will you be attending?</label>
          <div>
            <label>
              <input
                type="radio"
                value="yes"
                checked={isComing === 'yes'}
                onChange={(e) => setIsComing(e.target.value)}
                required
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                value="no"
                checked={isComing === 'no'}
                onChange={(e) => setIsComing(e.target.value)}
                required
              />
              No
            </label>
          </div>
        </div>

        <button type="submit">Submit RSVP</button>
      </form>

      <div className="message">{message}</div>
    </div>
  );
}

export default App;