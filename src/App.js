import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './index';
import { sendRSVPEmail } from './emailService';

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
  const [responseImageLeft, setResponseImageLeft] = useState('');
  
  const containerRef = useRef(null);

  const scrollToTop = () => {
    if (containerRef.current){
      containerRef.current.scrollTo(0, 0);
    }
  };

  // New state variable to toggle the form visibility
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [showOverlay] = useState(true); // New state for overlay visibility

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

        var rsvpParams = {
          firstName: firstName,
          lastName: lastName,
          isComing: isComing === 'yes',
          guestFirstName: guestFirstName,
          guestLastName: guestLastName
        }

        sendRSVPEmail(rsvpParams);
  
        // Set form submission state
        setFormSubmitted(true);

        scrollToTop();
  
        // Set response message based on attendance status
        if (isComing === 'yes') {
          scrollToTop();
          setResponseMessage('Veselimo se tvom dolasku!');
          setResponseImage('');
          setResponseImageLeft('https://i.imgur.com/undgumr.png');
        } else {
          scrollToTop();
          setResponseMessage('Žao nam je što ne možeš doći');
          setResponseImage('');
          setResponseImageLeft('');
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
    setResponseImageLeft('');
    setIsFormVisible(false); // Reset form visibility
    scrollToTop();
  };

  useEffect(() => {
    if (isComing !== 'yes') {
      setBringingGuest(false);
      setGuestFirstName('');
      setGuestLastName('');
    }
  }, [isComing]);

  return (
    <div className="container" ref={containerRef}>
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <div className="overlay-text">
              <p>Dragi gosti, stigle su nam fotografije našeg vjenčanja. Zbog količine i veličine fotografija morali smo podijeliti u dva linka.
              </p><br />
              <p>Ovdje možete pronaći fotografije s darivanja, photo bootha i prije sale</p>
              <a href="https://drive.google.com/drive/folders/1EY47QQNjT1ccGliaWvYeuTcbd9Bp4sEe?usp=sharing" target="_blank" rel="noopener noreferrer" className="overlay-link">
                Mix
              </a>
              <p>A ovdje možete pronaći fotografije iz sale</p>
              <a href="https://drive.google.com/drive/folders/1bSI9T0cHQojxWZTsbpEiiUStWf6h9iSQ?usp=sharing" target="_blank" rel="noopener noreferrer" className="overlay-link">
                Zoo Hotel
              </a>
            </div>
          </div>
        </div>
      )}
      {!formSubmitted ? (
        <>
          <div className="left-side">
            <img
              src="https://i.imgur.com/Bgb77go.png"
              alt="Wedding Invitation"
              className="portrait-image"
            />
          </div>
          <div className="right-side">
            <div className="wedding-text">
              {!isFormVisible ? ( // Toggle between wedding info and form
                <>
                  <h2 className="wedding-intro">
                    Ljudi su oni koji trenutke čine posebnima, pozivamo te da uljepšaš naše vjenčanje svojim dolaskom
                  </h2>
                  <p className="wedding-details">
                    11. TRAVNJA 2025.<br />
                  </p>
                  <div className="decorative-elements">
                      <img src="https://i.imgur.com/CShKlBl.png" alt="Stella and Zrin" className="wedding-names-image" />
                    </div>
                  <div className="wedding-info">
                    17:45 Okupljanje pred zgradom Županije u Osijeku<br />
                    19:00 Zoo Hotel Riverside
                  </div>
                  <button className="responseButton" onClick={() => {
                    setIsFormVisible(true);
                    scrollToTop();
                  }}>ODGOVORI</button> {/* Button to show the form */}
                  <p className="wedding-info2">
                    Molimo te da na pozivnicu odgovoriš najkasnije do 1. ožujka 2025. godine
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
                          <td>Dolaziš?</td>
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
                          <td>Vodiš li pratnju?</td>
                          <td>
                            <div className="radio-group">
                              <label className="radio-container">
                                <input
                                  type="checkbox"
                                  checked={bringingGuest}
                                  onChange={(e) => setBringingGuest(e.target.checked)}
                                  disabled={isComing !== 'yes'} // Disable unless 'Da' is selected for attendance
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
                                  placeholder=""
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
                                  placeholder=""
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
            {responseImageLeft && <img src={responseImageLeft} alt="Thank You" className="portrait-image" />}
          </div>
          <div className={`${responseImageLeft ? 'right-side' : 'no-image-class'}`}>
          <p className="response-message">{responseMessage}</p>
          <p className="wedding-details-last-page">
              11. TRAVNJA 2025.<br />
              <div className="decorative-elements-last-page">
                <img src="https://i.imgur.com/CShKlBl.png" alt="Stella and Zrin" className="wedding-names-image-last-page" />
              </div>
              <br />
            </p>
            {responseImage && <img src={responseImage} alt="Response" className="response-image" />}
              <p className="response-message-black">AKO ŽELIŠ OPET ISPUNITI OBRAZAC KLIKNI <a href="https://www.google.com" className="response-message-2" onClick={handleReset}>OVDJE</a></p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
