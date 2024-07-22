-> AI Med Reminder

AI Med Reminder is a mobile application built using React Native and Expo that helps users manage and get reminders for their medications. 
The app allows users to upload prescriptions, recognize text using OpenAI, and send notifications to WhatsApp via Twilio.

-> Features

-Medication Management:** upload prescriptions and get notification.
-Reminders:** Set and receive reminders for medication times.
-AI Integration:** Use OpenAI to recognize text from uploaded prescriptions.
-WhatsApp Notifications:** Send reminders to WhatsApp using Twilio.

-> Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed [Node.js](https://nodejs.org/en/download/)
- You have installed [Expo CLI](https://docs.expo.dev/get-started/installation/)
- You have signed up for [OpenAI API](https://beta.openai.com/signup/) and obtained an API key
- You have signed up for [Twilio](https://www.twilio.com/try-twilio) and obtained an API key




-> Installation

-> Frontend Setup

1. Fork or Clone the repository:
   git clone https://github.com/NagapavanTechWorm/med_app.git

2. Navigate to the project directory:
- cd med_app
- npm install
- npm start



-> Backend Setup
- cd backend
- npm install




-> In helperfunction.js, add the following code at line 63:

const OpenAI = require('openai');
import * as FileSystem from 'expo-file-system';

const apiKey = '#######'; // Replace with your actual API key
const openai = new OpenAI({ apiKey });



-> Start the backend server:
- npm install
- npm start
  
