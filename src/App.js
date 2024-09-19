import React, { useState } from 'react';
import './App.css';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './index';

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isComing, setIsComing] = useState('');
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseImage, setResponseImage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (firstName && lastName && isComing) {
      try {
        await addDoc(collection(db, "guests"), {
          firstName,
          lastName,
          isComing: isComing === 'yes',
        });
        setFormSubmitted(true);

        // Set response message and image based on the selection
        if (isComing === 'yes') {
          setResponseMessage('Veselimo se vašem dolasku!');
          setResponseImage('https://media.istockphoto.com/id/1142467597/vector/champagne-glass-vector-icon.jpg?s=612x612&w=0&k=20&c=6oXG-jkPEqaqgOfiKbgTxHzj7COX53Gku3o52H_KV3Y=');
        } else {
          setResponseMessage('Žao nam je što ne možete doći');
          setResponseImage('https://t3.ftcdn.net/jpg/01/12/43/90/360_F_112439022_Sft6cXK9GLnzWjjIkVMj2Lt34RcKUpxm.jpg');
        }
      } catch (error) {
        setMessage('Error submitting RSVP. Please try again.');
      }
    } else {
      setMessage('Please complete the form.');
    }
  };

  const handleReset = () => {
    setFirstName('');
    setLastName('');
    setIsComing('');
    setFormSubmitted(false);
    setMessage('');
    setResponseMessage('');
    setResponseImage('');
  };

  return (
    <div className="container">
      {!formSubmitted ? (
        <>
          <div className="left-side">
            <img
              src="https://i.imgur.com/72MLhx3.jpg"
              alt="Wedding Invitation"
              className="portrait-image"
            />
          </div>
          <div className="right-side">
            <div className="wedding-text">
              <h2 className="wedding-intro">
                Ljudi su oni koji trenutke čine posebnima, pozivamo vas da uljepšate naše vjenčanje svojim dolaskom
              </h2>
              <p className="wedding-details">
                11. TRAVNJA 2025.<br />
                <div className="decorative-elements">&#x2766;&#x2766;&#x2766;</div>
                <span className="wedding-names">Stella & Zrin</span>
                <div className="decorative-elements">&#x2766;&#x2766;&#x2766;</div>
                <br />
                18:00 Okupljanje pred zgradom Županije u Osijeku<br />
                19:00 Zoo Hotel Riverside
              </p>

              <form onSubmit={handleSubmit} className="rsvp-form">
                <table>
                  <tbody>
                    <tr>
                      <td>Ime:</td>
                      <td>
                        <input
                          type="text"
                          placeholder="Ime"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Prezime:</td>
                      <td>
                        <input
                          type="text"
                          placeholder="Prezime"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Dolazite?</td>
                      <td>
                        <select
                          value={isComing}
                          onChange={(e) => setIsComing(e.target.value)}
                          required
                        >
                          <option value="">Odaberite</option>
                          <option value="yes">Da</option>
                          <option value="no">Ne</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2">
                        <button type="submit">Submit</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>

              {message && <p>{message}</p>}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="left-side">
            <img
              src="https://i.imgur.com/a3NI9Vs.jpeg"
              alt="Thank You"
              className="portrait-image"
            />
          </div>
          <div className="right-side">
            <h2>{responseMessage}</h2>
            {responseImage && <img src={responseImage} alt="Response" className="response-image" />}
            <button className="reset-button" onClick={handleReset}>
              Ako želite opet ispuniti obrazac kliknite ovdje
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
