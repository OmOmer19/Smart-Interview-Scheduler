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
    
    // generating secure action links using booking id
    // it will allow candidate to cancel or reschedule without login
    const cancelLink = `${process.env.FRONTEND_URL}/cancel/${booking._id}`
    
    const rescheduleLink = `${process.env.FRONTEND_URL}/reschedule/${booking._id}`

    // html email body with - header ,body, title, subtitle,details,meet box, action buttons, footer
    const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;background:#0f172a;border:1px solid #1e293b;border-radius:12px;overflow:hidden">
      
      <div style="padding:20px 28px;border-bottom:1px solid #1e293b;display:flex;align-items:center;gap:10px">
        <div style="width:28px;height:28px;background:#2563eb;border-radius:6px;display:inline-flex;align-items:center;justify-content:center">
          <span style="color:#fff;font-size:14px">📅</span>
        </div>
        <span style="color:#f1f5f9;font-size:13px;font-weight:500">Interview Scheduler</span>
      </div>

      <div style="padding:28px">
        <div style="display:inline-block;background:#14532d;color:#4ade80;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:500;margin-bottom:16px">
          ✓ Confirmed
        </div>

        <div style="font-size:18px;font-weight:600;color:#f1f5f9;margin-bottom:6px">
          Your interview is confirmed
        </div>

        <div style="font-size:13px;color:#94a3b8;margin-bottom:20px;line-height:1.6">
          Hi ${booking.candidateName}, your interview has been scheduled. Here are the details:
        </div>

        <div style="background:#1e293b;border-radius:10px;padding:16px;margin-bottom:20px">
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #334155">
            <span style="font-size:12px;color:#94a3b8">Interviewer</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${interviewer.name}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #334155">
            <span style="font-size:12px;color:#94a3b8">Date</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${new Date(slot.startTime).toDateString()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #334155">
            <span style="font-size:12px;color:#94a3b8">Time</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${new Date(slot.startTime).toLocaleTimeString()} — ${new Date(slot.endTime).toLocaleTimeString()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:7px 0">
            <span style="font-size:12px;color:#94a3b8">Duration</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">30 minutes</span>
          </div>
        </div>

        <div style="background:#1e3a5f;border-radius:10px;padding:12px 16px;margin-bottom:20px;display:flex;align-items:center;gap:10px">
          <div style="width:32px;height:32px;background:#2563eb;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0">
            <span style="font-size:14px">🎥</span>
          </div>
          <div>
            <div style="font-size:12px;color:#93c5fd;font-weight:500">Google Meet link</div>
            <div style="font-size:11px;color:#93c5fd;opacity:0.8">Will be available in your calendar invite</div>
          </div>
        </div>

        <div style="display:flex;gap:10px">
          <a href="${cancelLink}" style="flex:1;background:#1e293b;color:#f1f5f9;border:1px solid #334155;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:500;text-align:center;text-decoration:none;display:block">
            Cancel booking
          </a>
          <a href="${rescheduleLink}" style="flex:1;background:#2563eb;color:#fff;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:500;text-align:center;text-decoration:none;display:block">
            Reschedule
          </a>
        </div>

      </div>
      
      <div style="padding:16px 28px;border-top:1px solid #1e293b;font-size:11px;color:#475569">
        You received this because someone booked an interview via Interview Scheduler.
      </div>

    </div>
    `
   
    // sending email to candidate
    await sendEmail(interviewer, booking.candidateEmail, subject, html)
}

// function to send booking confirmation(email) to interviewer when candidate book their slot
const sendBookingConfirmationToInterviewer  = async(interviewer, booking, slot) =>{
    // creating email subject
    const subject  = `New Interview Booked — ${booking.candidateName}`

    // html email body - header, body, title, subtitle, detail, dashboard, footer
    const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;background:#0f172a;border:1px solid #1e293b;border-radius:12px;overflow:hidden">
      
      <div style="padding:20px 28px;border-bottom:1px solid #1e293b;display:flex;align-items:center;gap:10px">
        <div style="width:28px;height:28px;background:#2563eb;border-radius:6px;display:inline-flex;align-items:center;justify-content:center">
          <span style="color:#fff;font-size:14px">📅</span>
        </div>
        <span style="color:#f1f5f9;font-size:13px;font-weight:500">Interview Scheduler</span>
      </div>

      <div style="padding:28px">

        <div style="display:inline-block;background:#1e3a5f;color:#93c5fd;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:500;margin-bottom:16px">
          🔔 New booking
        </div>

        <div style="font-size:18px;font-weight:600;color:#f1f5f9;margin-bottom:6px">
          New interview booked
        </div>

        <div style="font-size:13px;color:#94a3b8;margin-bottom:20px;line-height:1.6">
          Hi ${interviewer.name}, a candidate has booked one of your slots.
        </div>

        <div style="background:#1e293b;border-radius:10px;padding:16px;margin-bottom:20px">
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #334155">
            <span style="font-size:12px;color:#94a3b8">Candidate</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${booking.candidateName}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #334155">
            <span style="font-size:12px;color:#94a3b8">Email</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${booking.candidateEmail}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #334155">
            <span style="font-size:12px;color:#94a3b8">Date</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${new Date(slot.startTime).toDateString()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:${booking.note ? '1px solid #334155' : 'none'}">
            <span style="font-size:12px;color:#94a3b8">Time</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${new Date(slot.startTime).toLocaleTimeString()} — ${new Date(slot.endTime).toLocaleTimeString()}</span>
          </div>
          ${booking.note ? `
          <div style="display:flex;justify-content:space-between;padding:7px 0">
            <span style="font-size:12px;color:#94a3b8">Note</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${booking.note}</span>
          </div>` : ''}
        </div>

        <a href="${process.env.FRONTEND_URL}/dashboard" style="display:block;background:#2563eb;color:#fff;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:500;text-align:center;text-decoration:none">
          View in dashboard
        </a>

      </div>

      <div style="padding:16px 28px;border-top:1px solid #1e293b;font-size:11px;color:#475569">
        The Google Calendar event has been created on your calendar.
      </div>

    </div>
    `
    // sending to interviewer's own email
    await sendEmail(interviewer, interviewer.email, subject, html)
}

// function to send cancellation email to candidate 
const sendCancellationToCandidate = async (interviewer, booking, slot) =>{
    // creating subject with date so candidate know which interview was cancelled
    const subject = `Interview Cancelled — ${new Date(slot.startTime).toDateString()}`

    // html email body - header, body, title, subtitle, detail, book another button, footer
    const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;background:#0f172a;border:1px solid #1e293b;border-radius:12px;overflow:hidden">
      
      <div style="padding:20px 28px;border-bottom:1px solid #1e293b;display:flex;align-items:center;gap:10px">
        <div style="width:28px;height:28px;background:#2563eb;border-radius:6px;display:inline-flex;align-items:center;justify-content:center">
          <span style="color:#fff;font-size:14px">📅</span>
        </div>
        <span style="color:#f1f5f9;font-size:13px;font-weight:500">Interview Scheduler</span>
      </div>

      <div style="padding:28px">

        <div style="display:inline-block;background:#450a0a;color:#f87171;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:500;margin-bottom:16px">
          ✕ Cancelled
        </div>

        <div style="font-size:18px;font-weight:600;color:#f1f5f9;margin-bottom:6px">
          Your interview has been cancelled
        </div>

        <div style="font-size:13px;color:#94a3b8;margin-bottom:20px;line-height:1.6">
          Hi ${booking.candidateName}, your interview has been cancelled. The slot has been released.
        </div>

        <div style="background:#1e293b;border-radius:10px;padding:16px;margin-bottom:20px">
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #334155">
            <span style="font-size:12px;color:#94a3b8">Interviewer</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${interviewer.name}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #334155">
            <span style="font-size:12px;color:#94a3b8">Date</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${new Date(slot.startTime).toDateString()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:7px 0">
            <span style="font-size:12px;color:#94a3b8">Time</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${new Date(slot.startTime).toLocaleTimeString()} — ${new Date(slot.endTime).toLocaleTimeString()}</span>
          </div>
        </div>

        <a href="${process.env.FRONTEND_URL}/book" style="display:block;background:#2563eb;color:#fff;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:500;text-align:center;text-decoration:none">
          Book another slot
        </a>

      </div>

      <div style="padding:16px 28px;border-top:1px solid #1e293b;font-size:11px;color:#475569">
        The Google Calendar event has been removed from your calendar.
      </div>

    </div>
    `
    // sending to candidate's email
    await sendEmail(interviewer, booking.candidateEmail, subject, html)
}

// function to send email to interviewer when booking on theire slot ins cancelled
const sendCancellationToInterviewer = async (interviewer, booking, slot) => {
    // subject include candidate name so interviewer knowswhose booking cancelled
    const subject = `Interview Cancelled — ${booking.candidateName}`

    // html email body --header, body, title, subtitle, detail, dashboard, footer
    const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;background:#0f172a;border:1px solid #1e293b;border-radius:12px;overflow:hidden">
      
      <div style="padding:20px 28px;border-bottom:1px solid #1e293b;display:flex;align-items:center;gap:10px">
        <div style="width:28px;height:28px;background:#2563eb;border-radius:6px;display:inline-flex;align-items:center;justify-content:center">
          <span style="color:#fff;font-size:14px">📅</span>
        </div>
        <span style="color:#f1f5f9;font-size:13px;font-weight:500">Interview Scheduler</span>
      </div>

      <div style="padding:28px">

        <div style="display:inline-block;background:#450a0a;color:#f87171;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:500;margin-bottom:16px">
          ✕ Cancelled
        </div>

        <div style="font-size:18px;font-weight:600;color:#f1f5f9;margin-bottom:6px">
          Interview cancelled
        </div>

        <div style="font-size:13px;color:#94a3b8;margin-bottom:20px;line-height:1.6">
          Hi ${interviewer.name}, a candidate has cancelled their interview booking.
        </div>

        <div style="background:#1e293b;border-radius:10px;padding:16px;margin-bottom:20px">
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #334155">
            <span style="font-size:12px;color:#94a3b8">Candidate</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${booking.candidateName}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #334155">
            <span style="font-size:12px;color:#94a3b8">Email</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${booking.candidateEmail}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #334155">
            <span style="font-size:12px;color:#94a3b8">Date</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${new Date(slot.startTime).toDateString()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:7px 0">
            <span style="font-size:12px;color:#94a3b8">Time</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${new Date(slot.startTime).toLocaleTimeString()} — ${new Date(slot.endTime).toLocaleTimeString()}</span>
          </div>
        </div>

        <a href="${process.env.FRONTEND_URL}/dashboard" style="display:block;background:#2563eb;color:#fff;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:500;text-align:center;text-decoration:none">
          View in dashboard
        </a>

      </div>

      <div style="padding:16px 28px;border-top:1px solid #1e293b;font-size:11px;color:#475569">
        The slot has been released and is available for booking again.
      </div>

    </div>
    `

    /// sending to interviewer's email
    await sendEmail(interviewer, interviewer.email, subject, html)
}

// function to send email to candidate when booking - rescheduled
const sendRescheduleConfirmationToCandidate = async (interviewer, booking, newSlot) => {
    // subject includes new date so candidate knows the updated schedule
    const subject = `Interview Rescheduled — ${new Date(newSlot.startTime).toDateString()}`
    //action link - cancel
    const cancelLink = `${process.env.FRONTEND_URL}/cancel/${booking._id}`
    // html email body -- header, body, title, subtitle, detail,action buttons, footer
    const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;background:#0f172a;border:1px solid #1e293b;border-radius:12px;overflow:hidden">
      
      <div style="padding:20px 28px;border-bottom:1px solid #1e293b;display:flex;align-items:center;gap:10px">
        <div style="width:28px;height:28px;background:#2563eb;border-radius:6px;display:inline-flex;align-items:center;justify-content:center">
          <span style="color:#fff;font-size:14px">📅</span>
        </div>
        <span style="color:#f1f5f9;font-size:13px;font-weight:500">Interview Scheduler</span>
      </div>

      <div style="padding:28px">

        <div style="display:inline-block;background:#451a03;color:#fbbf24;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:500;margin-bottom:16px">
          📅 Rescheduled
        </div>

        <div style="font-size:18px;font-weight:600;color:#f1f5f9;margin-bottom:6px">
          Your interview has been rescheduled
        </div>

        <div style="font-size:13px;color:#94a3b8;margin-bottom:20px;line-height:1.6">
          Hi ${booking.candidateName}, your interview has been moved to a new time slot.
        </div>

        <div style="background:#1e293b;border-radius:10px;padding:16px;margin-bottom:20px">
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #334155">
            <span style="font-size:12px;color:#94a3b8">Interviewer</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${interviewer.name}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #334155">
            <span style="font-size:12px;color:#94a3b8">New date</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${new Date(newSlot.startTime).toDateString()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:7px 0">
            <span style="font-size:12px;color:#94a3b8">New time</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${new Date(newSlot.startTime).toLocaleTimeString()} — ${new Date(newSlot.endTime).toLocaleTimeString()}</span>
          </div>
        </div>

        <div style="display:flex;gap:10px">
          <a href="${cancelLink}" style="flex:1;background:#1e293b;color:#f1f5f9;border:1px solid #334155;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:500;text-align:center;text-decoration:none;display:block">
            Cancel booking
          </a>
          <a href="${process.env.FRONTEND_URL}/book" style="flex:1;background:#2563eb;color:#fff;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:500;text-align:center;text-decoration:none;display:block">
            View details
          </a>
        </div>

      </div>

      <div style="padding:16px 28px;border-top:1px solid #1e293b;font-size:11px;color:#475569">
        Your Google Calendar event has been updated with the new time.
      </div>

    </div>
    `

    // sending to candidate's email
    await sendEmail(interviewer, booking.candidateEmail, subject, html)
}

// function to send email to interviewer when a booking on their slot is rescheduled
const sendRescheduleConfirmationToInterviewer = async(interviewer, booking, newSlot) =>{
    // subject includes candidate name so interviewer knows whose booking was rescheduled
    const subject = `Interview Rescheduled — ${booking.candidateName}`

    // html email body --header, body, title, subtitle, detail, dashboard, footer
    const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;background:#0f172a;border:1px solid #1e293b;border-radius:12px;overflow:hidden">

      <div style="padding:20px 28px;border-bottom:1px solid #1e293b;display:flex;align-items:center;gap:10px">
        <div style="width:28px;height:28px;background:#2563eb;border-radius:6px;display:inline-flex;align-items:center;justify-content:center">
          <span style="color:#fff;font-size:14px">📅</span>
        </div>
        <span style="color:#f1f5f9;font-size:13px;font-weight:500">Interview Scheduler</span>
      </div>

      <div style="padding:28px">

        <div style="display:inline-block;background:#451a03;color:#fbbf24;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:500;margin-bottom:16px">
          📅 Rescheduled
        </div>

        <div style="font-size:18px;font-weight:600;color:#f1f5f9;margin-bottom:6px">
          Interview rescheduled
        </div>

        <div style="font-size:13px;color:#94a3b8;margin-bottom:20px;line-height:1.6">
          Hi ${interviewer.name}, a candidate has rescheduled their interview.
        </div>

        <div style="background:#1e293b;border-radius:10px;padding:16px;margin-bottom:20px">
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #334155">
            <span style="font-size:12px;color:#94a3b8">Candidate</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${booking.candidateName}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #334155">
            <span style="font-size:12px;color:#94a3b8">Email</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${booking.candidateEmail}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #334155">
            <span style="font-size:12px;color:#94a3b8">New date</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${new Date(newSlot.startTime).toDateString()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:7px 0">
            <span style="font-size:12px;color:#94a3b8">New time</span>
            <span style="font-size:12px;font-weight:500;color:#f1f5f9">${new Date(newSlot.startTime).toLocaleTimeString()} — ${new Date(newSlot.endTime).toLocaleTimeString()}</span>
          </div>
        </div>

        <a href="${process.env.FRONTEND_URL}/dashboard" style="display:block;background:#2563eb;color:#fff;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:500;text-align:center;text-decoration:none">
          View in dashboard
        </a>

      </div>

      <div style="padding:16px 28px;border-top:1px solid #1e293b;font-size:11px;color:#475569">
        Your Google Calendar event has been updated with the new time.
      </div>

    </div>
    `

    // sending to interviewer's own email
    await sendEmail(interviewer, interviewer.email, subject, html)
}

module.exports = {sendEmail,
     sendBookingConfirmationToCandidate,sendBookingConfirmationToInterviewer ,
     sendCancellationToCandidate, sendCancellationToInterviewer,
     sendRescheduleConfirmationToCandidate, sendRescheduleConfirmationToInterviewer
    }