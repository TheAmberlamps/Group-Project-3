// eslint-disable-next-line
import React, { useState } from "react";
import MomentUtils from "@date-io/moment";
import "./home.css";
// Material UI imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
// MaterialUI pickers imports.
import {
  DatePicker,
  TimePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
//Local imports - hooks, other components.
import useFetch from "./Hooks/userFind.js";
import NavBar from "./navBar.js";

//Creates a new meeting.
const handleMeetingCreation = (event, userData) => {
  event.preventDefault();

  let newDate = document.getElementById("newDate");
  let newTitle = document.getElementById("newTitle");
  let newMeetStart = document.getElementById("standard-basic newDateStart");
  let newMeetFullStart = newDate.value + "T" + newMeetStart.value + ":00"
  let newMeetEnd = document.getElementById("standard-basic newDateEnd");
  let newMeetFullEnd = newDate.value + "T" + newMeetEnd.value + ":00";
  let newDesc = document.getElementById("newDesc");
  const meetingData = {
    date: newDate.value,
    start: newMeetFullStart,
    end: newMeetFullEnd,
    title: newTitle.value,
    description: newDesc.value
  };
  fetch("/api/new-meeting", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meetingData)
  })
    .then(response => response.json())
    .then(data => createAttendees(data, userData));
};

//Gets the meeting id from the created meeting.
//Populates an array of users that the person has checked to include.
//API call does a bulk create to the attendees table.
const createAttendees = (meetingID, userData) => {
  let meetID = meetingID;
  let attendArray = [];

  // filter list of users to checked users only, then map to correct object structure
  attendArray = userData.filter(user => user.checked).map(user => ({MeetingId: meetingID, UserId: user.id}))
  fetch("/api/all-attendees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(attendArray)
  }).then(response => response.json());
};

const handleCheckChange = (event, userData, key, setUserData) => {
  userData[key].checked = event.target.checked
  setUserData(userData)
}

function ScheduleMeet(props) {
  const fetchData = useFetch("/api/all-users")
  const userData = fetchData[0]
  const setUserData = fetchData[1]

  const [selectedDate, handleDateChange] = useState(new Date());
  const [selectedDate2, handleDateChange2] = useState(new Date())

  
  return (
    <>
    <NavBar>
    </NavBar>
    <div className="meeting-picker">
      
      <h1 className="meeting-title">Schedule a New Meeting</h1>
      <Grid container 
        spacing={3}
        direction="row"
        justify="space-around"
        className="schedule-meeting-area">


      <Grid item xs={4}>

      <h2>Select your date and time for the meeting here.</h2>
      <MuiPickersUtilsProvider utils={MomentUtils}>
      <h3>Meeting Title</h3>
      <TextField
          name="Meeting Title"
          id="newTitle"
          className="meeting-title-field"
          label="Meeting #1..."
        />
      <h3>Meeting Description</h3>
      <TextField
          name="Meeting Description"
          id="newDesc"
          className="meeting-title-field"
          label="A short summary..."
        />
        <h3>Date of Meeting</h3>
        <DatePicker
          openTo="year"
          id="newDate"
          views={["year", "month", "date"]}
          value={selectedDate}
          format="YYYY-MM-DD"
          disablePast
          onChange={handleDateChange}

        />
        <h3>Start Time</h3>
        <TimePicker
          clearable
          ampm={false}
          label="24 hours"
          id="standard-basic newDateStart"
          
          value={selectedDate}
          onChange={handleDateChange}
        />
        <h3>End Time</h3>
        <TimePicker
          clearable
          ampm={false}
          label="24 hours"
          id="standard-basic newDateEnd"
          value={selectedDate2}
          onChange={handleDateChange2}
        />

        <div className="meeting-submit-btn">
          <Button
            id="meetSub"
            onClick={(event) => handleMeetingCreation(event, userData)}
            variant="contained"
            color="primary"
          >
            Book Meeting
          </Button>
        </div>
      </MuiPickersUtilsProvider>
      </Grid>

      <Grid item xs={4}>

        <h2>Meeting Attendees: </h2>
      <FormControl component="fieldset" className='formControl'>
        <FormLabel component="legend">Assign Members</FormLabel>
        <FormGroup>
        {userData.map((item, key) =>
            <FormControlLabel
              control={<Checkbox value={item.id} key={item.id} data-userid={item.id} onChange={(event) => handleCheckChange(event, userData, key, setUserData)}/>}
              label={item.name}
              key={key}
            />
        )}
        </FormGroup>
      </FormControl>
      </Grid>


      </Grid>
    </div>
    </>
  );
}

export default ScheduleMeet;
