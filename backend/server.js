const express = require('express');
const cron = require('node-cron');
const accountSid = ' '; //add accountSid
const authToken = '';  //add authtoken
 const client = require('twilio')(accountSid, authToken);

const app = express();
app.use(express.json());

function sendWhatsAppMessage(to, body) {
    client.messages
        .create({
            body: body,
            from: 'whatsapp:+14155238886',
            to: `whatsapp:${to}`
        })
        .then(message => console.log(message.sid))
        .catch(error => console.error('Error sending message:', error));
}

function parseTimeTo24HourFormat(time) {
    const [timePart, period] = time.trim().split(' ');
    let [hour, minute] = timePart.split(':');
    
    hour = parseInt(hour);
    minute = parseInt(minute);
    
    if (period.toUpperCase() === 'PM' && hour !== 12) {
        hour += 12;
    } else if (period.toUpperCase() === 'AM' && hour === 12) {
        hour = 0;
    }
    
    return `${hour}:${minute}`;
}

let scheduledJobs = {};

function scheduleMessage(tablet, day, time, number) {
    const twentyFourHourTime = parseTimeTo24HourFormat(time);
    const [hour, minute] = twentyFourHourTime.split(':');
    const cronTime = `${minute} ${hour} * * ${day}`;
    
    const job = cron.schedule(cronTime, () => {
        console.log(`Sending message to tablet: ${tablet} at ${time} on day ${day}`);
        sendWhatsAppMessage(`+91${number}`, `Hey👋 its time to take your ${tablet}`);
    });

    return job;
}

function resetAndSchedule(schedules) {
    try {
        scheduledJobs = {};

        // Schedule new jobs based on the provided schedules
        Object.keys(schedules).forEach(tablet => {
            if(tablet != "number"){
                const { day, time } = schedules[tablet];
                console.log('=====444444===============================');
                console.log(schedules[tablet]);
                console.log('====================================');
                if (!scheduledJobs[tablet]) {
                    scheduledJobs[tablet] = [];
                }
                day.forEach(d => {
                    time.forEach(t => {
                        const job = scheduleMessage(tablet, d, t,schedules.number);
                        scheduledJobs[tablet].push(job);
                    });
            });
            }
            
        });

    } catch (error) {
        console.error('Error resetting and scheduling jobs:', error);
    }
}

app.post('/schedule', (req, res) => {
    const schedules = req.body;
    console.log('====================================');
    console.log(schedules);
    console.log('====================================');
    resetAndSchedule(schedules);
    res.send('Schedules set successfully');
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
