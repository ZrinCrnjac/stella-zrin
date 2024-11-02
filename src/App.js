import React, { useState } from 'react';
import './App.css';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './index';

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isComing, setIsComing] = useState('');
  const [bringingGuest, setBringingGuest] = useState(false); // Track if a guest is being brought
  const [guestFirstName, setGuestFirstName] = useState(''); // Guest's first name
  const [guestLastName, setGuestLastName] = useState(''); // Guest's last name

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseImage, setResponseImage] = useState('');
  
  // New state variable to toggle the form visibility
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate input fields
    if (firstName && lastName && isComing) {
      try {
        // Create main guest data
        const guestData = {
          firstName,
          lastName,
          isComing: isComing === 'yes',
        };
  
        // Add main guest to the database
        await addDoc(collection(db, "guests"), guestData);
  
        // Check if a guest is being brought
        if (bringingGuest) {
          // Validate guest's information
          if (guestFirstName && guestLastName) {
            // Create guest data
            const extraGuestData = {
              firstName: guestFirstName,
              lastName: guestLastName,
              isComing: true, // Automatically set guest attendance to true
            };
  
            // Add guest's data to the database
            await addDoc(collection(db, "guests"), extraGuestData);
          } else {
            setResponseMessage('Please fill out guest information.');
            return; // Stop execution if guest information is incomplete
          }
        }
  
        // Set form submission state
        setFormSubmitted(true);
  
        // Set response message based on attendance status
        if (isComing === 'yes') {
          setResponseMessage('Veselimo se vašem dolasku!');
          setResponseImage('https://i.imgur.com/1IVRbrN.png');
        } else {
          setResponseMessage('Žao nam je što ne možete doći');
          setResponseImage('');
        }
      } catch (error) {
        console.error("Error submitting RSVP:", error); // Log the error for debugging
        setResponseMessage('Error submitting RSVP. Please try again.');
      }
    } else {
      setResponseMessage('Please complete the form.');
    }
  };

  const handleReset = () => {
    setFirstName('');
    setLastName('');
    setIsComing('');
    setBringingGuest(false);
    setGuestFirstName('');
    setGuestLastName('');
    setFormSubmitted(false);
    setResponseMessage('');
    setResponseImage('');
    setIsFormVisible(false); // Reset form visibility
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
              {!isFormVisible ? ( // Toggle between wedding info and form
                <>
                  <h2 className="wedding-intro">
                    Ljudi su oni koji trenutke čine posebnima, pozivamo vas da uljepšate naše vjenčanje svojim dolaskom
                  </h2>
                  <p className="wedding-details">
                    11. TRAVNJA 2025.<br />
                    <div className="decorative-elements">
                      <img src="https://i.imgur.com/CShKlBl.png" alt="Stella and Zrin" className="wedding-names-image" />
                    </div>
                    <br />
                  </p>
                  <div className="wedding-info">
                    17:45 Okupljanje pred zgradom Županije u Osijeku<br />
                    19:00 Zoo Hotel Riverside
                  </div>
                  <button className="responseButton" onClick={() => setIsFormVisible(true)}>ODGOVORI</button> {/* Button to show the form */}
                  <p className="wedding-info2">
                    Molimo da na pozivnicu odgovorite najkasnije do 1. ožujka 2025. godine
                  </p>
                </>
              ) : ( // Form section
                <>
                  <button className="back-button" onClick={() => setIsFormVisible(false)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24" /* Size will inherit from CSS */
                      height="24" /* Size will inherit from CSS */
                    >
                      <path d="M15 19l-7-7 7-7" /> {/* Arrow path */}
                    </svg>
                    NATRAG
                  </button>
                  {!bringingGuest && (
                    <img src="https://i.imgur.com/H3JiRGH.png" alt="Additional Info" className="additional-image" />
                  )}
                  <form 
                    onSubmit={handleSubmit} 
                    className={`rsvp-form ${bringingGuest ? 'guest-selected' : ''}`} 
                  >
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
                            <div className="radio-group">
                              <label className="radio-container">
                                <input
                                  type="radio"
                                  id="yes"
                                  name="attendance"
                                  value="yes"
                                  checked={isComing === 'yes'}
                                  onChange={(e) => setIsComing(e.target.value)}
                                  required
                                />
                                <div className="custom-radio"></div>
                                Da
                              </label>
                              <label className="radio-container">
                                <input
                                  type="radio"
                                  id="no"
                                  name="attendance"
                                  value="no"
                                  checked={isComing === 'no'}
                                  onChange={(e) => setIsComing(e.target.value)}
                                  required
                                />
                                <div className="custom-radio"></div>
                                Ne
                              </label>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>Vodite li pratnju?</td>
                          <td>
                            <div className="radio-group">
                              <label className="radio-container">
                                <input
                                  type="checkbox"
                                  checked={bringingGuest}
                                  onChange={(e) => setBringingGuest(e.target.checked)}
                                />
                                <div className="custom-checkbox"></div>
                                Da
                              </label>
                            </div>
                          </td>
                        </tr>
                        {bringingGuest && (
                          <>
                            <tr>
                              <td>Ime pratnje:</td>
                              <td>
                                <input
                                  type="text"
                                  placeholder="Ime pratnje"
                                  value={guestFirstName}
                                  onChange={(e) => setGuestFirstName(e.target.value)}
                                  required
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Prezime pratnje:</td>
                              <td>
                                <input
                                  type="text"
                                  placeholder="Prezime pratnje"
                                  value={guestLastName}
                                  onChange={(e) => setGuestLastName(e.target.value)}
                                  required
                                />
                              </td>
                            </tr>
                          </>
                        )}
                        <tr>
                          <td colSpan="2">
                            <button type="submit" className="responseButton">ODGOVORI</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </form>
                </>
              )}
              {responseMessage && <p>{responseMessage}</p>}
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
            <p className="response-message">{responseMessage}</p>
            {responseImage && <img src={responseImage} alt="Response" className="response-image" />}
              <p className="response-message-black">AKO ŽELITE OPET ISPUNITI OBRAZAC KLIKNITE <a href="#" className="response-message-2" onClick={handleReset}>OVDJE</a></p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
