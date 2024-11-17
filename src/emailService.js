import emailjs from 'emailjs-com';

// Function to send email via EmailJS
export const sendRSVPEmail = (rsvp) => {
  const emailParams = {
    firstName: rsvp.firstName,
    lastName: rsvp.lastName,
    isComing: rsvp.isComing ? 'Attending' : 'Not Attending',
    guestFirstName: rsvp.guestFirstName || '',
    guestLastName: rsvp.guestLastName || '',
  };

  emailjs.send('service_rnerye9', 'template_a48pvzd', emailParams, 'SGK4yXu1zCL_UYp4y')
    .then((response) => {
      console.log('Email sent successfully:', response);
    })
    .catch((error) => {
      console.error('Error sending email:', error);
    });
};
