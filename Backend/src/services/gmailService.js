const {google} = require("googleapis")
const {getOAuthClient} = require("../config/googleCalendar.config")

// function to create mime message - standard email format
const createMimeMessage = (to, subject, htmlBody) =>{
    // creating raw email string with required headers
    const message = [
        `To: ${to}`,  // recipient email
        `Subject: ${subject}`, // email subject
        `MIME-Version: 1.0`, //standaed mime version
        `Content-Type: text/html; charset=utf-8`, // telling email client to render html
        ``,  // blank line required between headers and body
        htmlBody   // actual email content
    ].join("\n")

    return Buffer.from(message).toString("base64url")
}


// main fucntion to send emails via gmail api
const sendEmail = async(interviewer, to, subject, htmlBody) =>{
    // getting authenticated google client using intervoewer's stored token
    const oauthClient = getOAuthClient(
        interviewer.accessToken,
        interviewer.refreshToken
    )
    // creating gmail api instance with authenticated cient
    const gmail = google.gmail({version: "v1", auth: oauthClient})

    // encoding the email into base64url MIME format
    const encodedMessage = createMimeMessage(to, subject, htmlBody)

    // sending the email 
    await gmail.users.messages.send({
        userId: "me", // me means send as the authenticated user(intwrviewer)
        requestBody: {
            raw: encodedMessage
        }
    })
}

// function to send booking confirmation to candidate
const sendBookingConfirmationToCandidate = async(interviewer, booking, slot) =>{
    // creating email subject using interview date
    const subject = `Interview Confirmed - ${new Date(slot.startTime).toDateString()}`
    
    // generating secure action links using token stored in booking 
    // it will allow candidate to cancel or reschedule without login
    // const cancelLink = `${process.env.FRONTEND_URL}/cancel/${booking.actionToken}`
    
    // const rescheduleLink = `${process.env.FRONTEND_URL}/reschedule/${booking.actionToken}`

    // html email body
    const html = `
      <h2>Your Interview is Confirmed</h2>
      <p>Your interview has been scheduled with <strong>${interviewer.name}</strong>.</p>
      <ul>
            <li><strong>Date:</strong> ${new Date(slot.startTime).toDateString()}</li>
            <li><strong>Time:</strong> ${new Date(slot.startTime).toLocaleTimeString()} — ${new Date(slot.endTime).toLocaleTimeString()}</li>
            <li><strong>Interviewer:</strong> ${interviewer.name}</li>
    </ul>
    <p>You will receive a Google Calendar invite separately.</p>
    <br/>
    `
    //action link will be added after the br tag
    // <a href="${cancelLink}">Cancel Booking</a> &nbsp;|&nbsp;
    // <a href="${rescheduleLink}">Reschedule</a>

    // sending email to candidate
    await sendEmail(interviewer, booking.candidateEmail, subject, html)
}

// function to send booking confirmation(email) to interviewer when candidate book their slot
const sendBookingConfirmationToInterviewer  = async(interviewer, booking, slot) =>{
    // creating email subject
    const subject  = `New Interview Booked — ${booking.candidateName}`

    // html email body
    const html = `
    <h2>New Interview Booked</h2>
    <p>Hi ${interviewer.name},</p>
    <p><strong>${booking.candidateName}</strong> has booked an interview slot.</p>
    <ul>
            <li><strong>Date:</strong> ${new Date(slot.startTime).toDateString()}</li>
            <li><strong>Time:</strong> ${new Date(slot.startTime).toLocaleTimeString()} — ${new Date(slot.endTime).toLocaleTimeString()}</li>
            <li><strong>Candidate Email:</strong> ${booking.candidateEmail}</li>
            ${booking.note ? `<li><strong>Note from candidate:</strong> ${booking.note}</li>` : ""}
    </ul>
    <p>The Google Calendar event has been created on your calendar.</p>
    `
    // sending to interviewer's own email
    await sendEmail(interviewer, interviewer.email, subject, html)
}

// function to send cancellation email to candidate 
const sendCancellationToCandidate = async (interviewer, booking, slot) =>{
    // creating subject with date so candidate know which interview was cancelled
    const subject = `Interview Cancelled — ${new Date(slot.startTime).toDateString()}`

    // html email body
    const html = `
        <h2>Your Interview Has Been Cancelled</h2>
        <p>Hi ${booking.candidateName},</p>
        <p>Your interview scheduled with <strong>${interviewer.name}</strong> has been cancelled.</p>
        <ul>
            <li><strong>Date:</strong> ${new Date(slot.startTime).toDateString()}</li>
            <li><strong>Time:</strong> ${new Date(slot.startTime).toLocaleTimeString()} — ${new Date(slot.endTime).toLocaleTimeString()}</li>
        </ul>
        <p>The Google Calendar event has been removed from your calendar.</p>
        <p>If you'd like to reschedule, please visit the booking page again.</p>
    `
    // sending to candidate's email
    await sendEmail(interviewer, booking.candidateEmail, subject, html)
}

// function to send email to interviewer when booking on theire slot ins cancelled
const sendCancellationToInterviewer = async (interviewer, booking, slot) => {
    // subject include candidate name so interviewer knowswhose booking cancelled
    const subject = `Interview Cancelled — ${booking.candidateName}`

    // html email body
    const html = `
        <h2>Interview Cancelled</h2>
        <p>Hi ${interviewer.name},</p>
        <p><strong>${booking.candidateName}</strong> has cancelled their interview.</p>
        <ul>
            <li><strong>Date:</strong> ${new Date(slot.startTime).toDateString()}</li>
            <li><strong>Time:</strong> ${new Date(slot.startTime).toLocaleTimeString()} — ${new Date(slot.endTime).toLocaleTimeString()}</li>
            <li><strong>Candidate Email:</strong> ${booking.candidateEmail}</li>
        </ul>
        <p>The slot has been released and is available for booking again.</p>
    `
    /// sending to interviewer's email
    await sendEmail(interviewer, interviewer.email, subject, html)
}

// function to send email to candidate when booking - rescheduled
const sendRescheduleConfirmationToCandidate = async (interviewer, booking, newSlot) => {
    // subject includes new date so candidate knows the updated schedule
    const subject = `Interview Rescheduled — ${new Date(newSlot.startTime).toDateString()}`
    // html email body
    const html = `
        <h2>Your Interview Has Been Rescheduled</h2>
        <p>Hi ${booking.candidateName},</p>
        <p>Your interview with <strong>${interviewer.name}</strong> has been rescheduled.</p>
        <ul>
            <li><strong>New Date:</strong> ${new Date(newSlot.startTime).toDateString()}</li>
            <li><strong>New Time:</strong> ${new Date(newSlot.startTime).toLocaleTimeString()} — ${new Date(newSlot.endTime).toLocaleTimeString()}</li>
            <li><strong>Interviewer:</strong> ${interviewer.name}</li>
        </ul>
        <p>Your Google Calendar event has been updated with the new time.</p>
    `

    // sending to candidate's email
    await sendEmail(interviewer, booking.candidateEmail, subject, html)
}

// function to send email to interviewer when a booking on their slot is rescheduled
const sendRescheduleConfirmationToInterviewer = async(interviewer, booking, newSlot) =>{
    // subject includes candidate name so interviewer knows whose booking was rescheduled
    const subject = `Interview Rescheduled — ${booking.candidateName}`

    // html email body
    const html = `
        <h2>Interview Rescheduled</h2>
        <p>Hi ${interviewer.name},</p>
        <p><strong>${booking.candidateName}</strong> has rescheduled their interview.</p>
        <ul>
            <li><strong>New Date:</strong> ${new Date(newSlot.startTime).toDateString()}</li>
            <li><strong>New Time:</strong> ${new Date(newSlot.startTime).toLocaleTimeString()} — ${new Date(newSlot.endTime).toLocaleTimeString()}</li>
            <li><strong>Candidate Email:</strong> ${booking.candidateEmail}</li>
        </ul>
        <p>Your Google Calendar event has been updated with the new time.</p>
    `

    // sending to interviewer's own email
    await sendEmail(interviewer, interviewer.email, subject, html)
}

module.exports = {sendEmail,
     sendBookingConfirmationToCandidate,sendBookingConfirmationToInterviewer ,
     sendCancellationToCandidate, sendCancellationToInterviewer,
     sendRescheduleConfirmationToCandidate, sendRescheduleConfirmationToInterviewer
    }