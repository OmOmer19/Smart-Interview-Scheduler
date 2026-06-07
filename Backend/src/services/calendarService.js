const {google} = require("googleapis")

// Oauth client factory
const {getOAuthClient} = require("../config/googleCalendar.config") 

//function to create google calendar event

const createCalendarEvent = async(
    interviewer, candidateEmail, 
    candidateName, startTime, endTime
) => {
    // creating authenticated Oauth client using interviewer's tokens
    const oauthClient = getOAuthClient(
        interviewer.accessToken,
        interviewer.refreshToken
    )
    // creating calendar instance
    const calendar = google.calendar({
        version: "v3",
        auth: oauthClient
    })
    // creating event in google calendar
    const response = await calendar.events.insert({
        // primary calendar of interviewer
        calendarId: "primary",

        requestBody:{
            //event title
            summary: `Interview with ${candidateName}`,
            // event description
            description: "Interview scheduled through Smart Interview Scheduler",
            // event start time 
            start: {
                dateTime: startTime
            },
            // event end time
            end: {
                dateTime: endTime
            },
            //attendees
            attendees: [
                {
                    email: interviewer.email
                },
                {
                    email: candidateEmail
                }
            ]
        },
        // asking google to send invites
        sendUpdates: "all"
    })

    // returning created evemt
    return response.data
}

// function to delete calendar event
const deleteCalendarEvent = async (user, eventId) =>{
    try{
        // if user has not valid access token
        if (!user.accessToken) {
            throw new Error("User has no Google access token")
        }
        // creating Oauth client for google apis
        const auth = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_CALLBACK_URL
        )
        // attaching user credentials(acces + refresh token)
        auth.setCredentials({
            access_token: user.accessToken,
            refresh_token: user.refreshToken
        })
        // initializing google calendar api
        const calendar = google.calendar({version: "v3", auth})

        // deleting event from primary calendar
        await calendar.events.delete({
            calendarId: "primary",
            eventId: eventId
        })
        return true
    }
    catch(err){
        console.log("Error deleting calendar event:", err.message)
        return false
    }
}

// function to update google calendar event -> for rescheduling
const updateCalendarEvent = async (user, eventId, slot) => {
    try{
        // if user has not valid access token
        if(!user.accessToken){
            throw new Error("User has no Google access token")
        }
        // creating Oauth client for google apis
        const auth = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_CALLBACK_URL
        )
        // attaching user credentials(acces + refresh token)
        auth.setCredentials({
            access_token: user.accessToken,
            refresh_token: user.refreshToken
        })
        // initializing google calendar api
        const calendar = google.calendar({ version: "v3", auth })

        // updating calender event
        await calendar.events.update({
            calendarId: "primary",
            eventId: eventId,
            requestBody:{
                summary: "Interview Rescheduled",
                start:{
                    dateTime: slot.startTime
                },
                end: {
                    dateTime: slot.endTime
                }
            }
        })
        return true
    }
    catch(err){
        console.log("Error updating calendar event:", err.message)
        return false
    }
}

module.exports = {createCalendarEvent, deleteCalendarEvent, updateCalendarEvent}