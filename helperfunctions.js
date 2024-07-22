import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to store data
export const storeData = async (key, value) => {
  try {
    if(value ===null){
      await AsyncStorage.removeItem(key);
    }
    else{
      await AsyncStorage.setItem(key, value);
      console.log(`Data stored successfully for key: ${key}`);
    }
  } catch (error) {
    console.error(`Error storing data for key ${key}:`, error);
  }
};

// Function to retrieve data
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.log(`Retrieved data for key ${key}:`, value);
      return value;
    } else {
      console.log(`No data found for key ${key}`);
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving data for key ${key}:`, error);
    return null;
  }
};

// Function to clear data for a specific key
export const clearData = async (name,key) => {
  console.log(name)
  console.log(key)
  try {
     let medData = await getData(key);
     console.log("med",typeof medData)
     medData= JSON.parse(medData);
     const updatedData = medData.medicines.filter((item)=>item!=name); 
     console.log("updated",updatedData)
     await storeData(key,JSON.stringify(updatedData))
    console.log(`Data cleared successfully for key: ${key}`);
  } catch (error) {
    console.error(`Error clearing data for key ${key}:`, error);
  }
};

// Function to clear all data
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    console.log('All data cleared successfully');
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};


//add the code in readme here...

// Function to encode an image file to base64 format
export async function encodeImage(imagePath) {
    try {
      const fileInfo = await FileSystem.readAsStringAsync(imagePath, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return fileInfo;
    } catch (error) {
      console.error('Error encoding image:', error);
      throw error;
    }
  }

// Helper function to get medicines from image
export async function getMedicinesFromImage(imagePath) {
  try {
    const base64Image = await encodeImage(imagePath);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { "type": "json_object" },
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Please provide the names of all the medicines shown in the image along with a one line description with common words for each. Also, if there is a specific time mentioned in the prescription for taking these medicines (such as 1-1-1), if it is 1-0-0 then set time as then give me 09:00 AM-no-no if 0-1-0 then no-01:00 PM-no and 0-0-1 then no-no-09:00 PM  include that in a JSON format like this: {\"medicines\":[{\"name\":\"med1\", day:[0,1,2,3,4,5,6],\"description\":\"desc1\", \"time\":\"09:00 AM-01:00 PM-09:00 PM\"}, {\"name\":\"med2\", \"description\":\"desc2\", day:[0,1,2,3,4,5,6],\"time\":\"09:00 AM-01:00 PM-09:00 AM\"}]}" },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`, // Include base64 image here
              },
            },
          ],
        },
      ],
    });

    const jsonResponse = JSON.parse(response.choices[0].message.content);
    return jsonResponse;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function scheduleCronJob() {
  try {
    console.log('====================================');
    console.log("hi");
    console.log('====================================');
    let meds = await getData("tablets");
    meds = JSON.parse(meds);

    const cron_data = {};
    for (const med of meds.medicines) { // Accessing 'medicines' array within 'meds'
      // Extract medicine name and time
      const { name, time, day } = med;
      
      // Split time string into an array and filter out 'no' values
      const timeArray = time.split("-").filter(t => t !== "no");
      
      // Assign to cron_data with the medicine name as key
      cron_data[name] = {
        time: timeArray,
        day: day
      };
    }
    
    cron_data.number = await getData("mobile")

    // Make POST request to your local server
    const url = 'http://192.168.188.124:3001/schedule';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cron_data)
    };

    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.text();
      console.log('Schedule set successfully:', data);
    } else {
      throw new Error('Failed to set schedule');
    }
  } catch (error) {
    console.error('Error scheduling cron job:', error);
  }
}
