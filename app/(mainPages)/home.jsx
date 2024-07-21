import {  Animated,Easing,Image, Text, TouchableOpacity, View,FlatList, ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar'
import {useEffect, useState, useRef} from "react";
import { encodeImage, getData, getMedicinesFromImage, storeData,clearData, scheduleCronJob } from '../../helperfunctions';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import DateTimePickerModal from "react-native-modal-datetime-picker";



// const Card = ({ data, handleDelete, handleEdit }) => {
//   const { description, name, time } = data;
//   const [notificationTimeArray, setNotificationTimeArray] = useState(time.split('-'));
//   const [editingIndex, setEditingIndex] = useState(-1);

//   const handleTimeEdit = (index, newValue) => {
//     const updatedTimes = [...notificationTimeArray];
//     updatedTimes[index] = newValue;
//     setNotificationTimeArray(updatedTimes);
//   };

//   const handleSaveEdit = () => {
//     handleEdit(name, notificationTimeArray.join('-'));
//     setEditingIndex(-1); // Exit edit mode
//   };

//   return (
//     <View className="bg-white flex flex-row justify-between items-center m-3 px-3 py-2 rounded-md border-orange-400 border-4">
//       <View className="flex flex-col justify-center items-start">
//         <Text className="text-black text-xl font-semibold mb-1">{name}</Text>
//         <Text className="text-black text-sm w-[220px]">{description}</Text>
//         <View className="flex flex-row items-center justify-start gap-2 mt-1">
//           {notificationTimeArray.map((timeSlot, index) => (
//             <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
//               {editingIndex === index ? (
//                 <TextInput
//                   style={{
//                     borderWidth: 1,
//                     borderColor: '#ccc',
//                     borderRadius: 5,
//                     paddingHorizontal: 8,
//                     paddingVertical: 4,
//                     minWidth: 60,
//                     textAlign: 'center',
//                   }}
//                   value={timeSlot}
//                   onChangeText={(text) => handleTimeEdit(index, text)}
//                 />
//               ) : (
//                 <TouchableOpacity onPress={() => setEditingIndex(index)}>
//                   <Text className="text-black text-[12px] border-orange-400 rounded-md border-2 w-[70px] text-center p-1">
//                     {timeSlot}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           ))}
//         </View>
//         {editingIndex !== -1 && (
//           <TouchableOpacity onPress={handleSaveEdit}>
//             <Text style={{ color: 'blue', marginTop: 5 }}>Save</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//       <TouchableOpacity onPress={() => handleDelete(name)}>
//         <AntDesign name="delete" size={20} color="red" />
//       </TouchableOpacity>
//     </View>
//   );
// };

const Card = ({ data, handleDelete, handleEdit }) => {
  const { description, name, time, day } = data;
  const [notificationTimeArray, setNotificationTimeArray] = useState(time.split('-'));
  const [selectedDays, setSelectedDays] = useState(day); // Initialize state with day array
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);

  const showTimePicker = (index) => {
    setEditingIndex(index);
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setEditingIndex(-1);
    setTimePickerVisible(false);
  };

  const handleConfirm = (selectedTime) => {
    const formattedTime = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedTimes = [...notificationTimeArray];
    updatedTimes[editingIndex] = formattedTime;
    setNotificationTimeArray(updatedTimes);
    handleEdit(name, updatedTimes.join('-'), selectedDays);
    hideTimePicker();
  };

  const handleDayToggle = (index) => {
    const updatedDays = selectedDays.includes(index)
      ? selectedDays.filter(dayIndex => dayIndex !== index)
      : [...selectedDays, index];
    setSelectedDays(updatedDays);
    handleEdit(name, notificationTimeArray.join('-'), updatedDays);
  };

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <View className="bg-white flex flex-row justify-between items-center m-2 p-2 rounded border-2 border-orange-500">
      <View className="flex-1 flex flex-col justify-center items-start">
        <Text className="text-black text-xl font-bold mb-1">{name}</Text>
        <Text className="text-black text-sm w-56" >{description}</Text>
        <View className=" mb-4 w-full gap-2 flex flex-row items-center justify-between mt-1">
          <View className="flex flex-row justify-center items-center gap-1">
          {notificationTimeArray.map((timeSlot, index) => (
            <TouchableOpacity  key={index} onPress={() => showTimePicker(index)}>
              <View className="h-10 border-2 border-orange-500 rounded w-[75px] text-center flex justify-center items-center p-1">
                <Text className="text-black text-xs " >{timeSlot}</Text>
              </View>
            </TouchableOpacity>
          ))}
          </View>
        <TouchableOpacity onPress={() => handleDelete(name)}>
            <AntDesign name="delete" size={20} color="red" />
      </TouchableOpacity>
        </View>

        <View className="flex self-center flex-row gap-2">
          {daysOfWeek.map((dayLabel, index) => (
            <TouchableOpacity key={index} onPress={() => handleDayToggle(index)}>
              <View className={`w-8 h-8 rounded-full flex justify-center items-center ${selectedDays.includes(index) ? 'bg-orange-600' : 'bg-orange-300'}`}>
                <Text className="text-white font-semibold">{dayLabel}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      
      </View>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideTimePicker}
      />
    </View>
  );
};

export default function App() {

  const scaleValue = useRef(new Animated.Value(1)).current;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 200,
      height: 200,
    },
  });

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 0.9,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    animate();
  }, [scaleValue]);


  const [img, setImg] = useState("")
  const [data, setData] = useState({})


  // const handleDelete = async (name) => {
  //   try {
  //     const updatedMedicines = data.medicines.filter((item) => item.name !== name);
  //     console.log("here",name, updatedMedicines)
  //     setData({ ...data, medicines: updatedMedicines });
  //     await storeData("tablets", JSON.stringify({ ...data, medicines: updatedMedicines }));
  //     if(updatedMedicines.length ===0){
  //       console.log("hjfhkjdashfjdajfgdsafhdsghgah")
  //       await storeData("tablets", null);
  //       router.navigate("/intro")
  //     }
  //   } catch (error) {
  //     console.error(`Error updating data:`, error);
  //   }
  // };

  // Update handleDelete to include handleEdit functionality
const handleDelete = async (name) => {
  try {
    const updatedMedicines = data.medicines.filter((item) => item.name !== name);
    setData({ ...data, medicines: updatedMedicines });
    await storeData("tablets", JSON.stringify({ ...data, medicines: updatedMedicines }));
    if (updatedMedicines.length === 0) {
      await storeData("tablets", null);
      router.navigate("/intro");
    }
  } catch (error) {
    console.error(`Error updating data:`, error);
  }
};

// Function to handle editing notification times
const handleEdit = async (name, newTime, newDays) => {
  try {
    const updatedMedicines = data.medicines.map((item) =>
      item.name === name ? { ...item, time: newTime, day: newDays } : item
    );
    setData({ ...data, medicines: updatedMedicines });
    await storeData("tablets", JSON.stringify({ ...data, medicines: updatedMedicines }));
    console.log('====================================');
    console.log(data.medicines);
    console.log('====================================');
    await scheduleCronJob();
  } catch (error) {
    console.error(`Error updating time for ${name}:`, error);
  }
};


  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imgUrl = await getData("url");
        setImg(imgUrl);
      } catch (error) {
        console.error('Error fetching data:', error);
        setImg(null); // or set a default image URL
      }
    };

    fetchImage();
  }, []);

  useEffect(() => {
    const fetchTabletData = async () => {
      try {
        const tablets = await getData("tablets");
        if (tablets === null) {
          console.log("Fetching tablet data...");
          const data = await getMedicinesFromImage(img);
          setData(data);
          await storeData("tablets", JSON.stringify(data));
        } else {
          console.log("Setting data from AsyncStorage...");
          setData(JSON.parse(tablets));
          const data = getData("tablets")
          console.log(data)
        }
      } catch (error) {
        console.log('Error in useEffect:', error);
      }
    };

    if (img !== "") {
      fetchTabletData();
    }

  }, [img]);


  if(img === null){
    return(
      <Text>Loading...</Text>
    )
  }

  if(Object.keys(data).length === 0)
  {
    return(
      <View className="flex h-full bg-[#03001c] justify-center items-center px-10">
        <Animated.Image
        source={require('../../assets/landing.png')}
        className="w-20 h-20"
        resizeMethod="contain"
        style={[styles.image, { transform: [{ scale: scaleValue }] }]}
        
      />
        <Text className="text-xl text-[#B6EADA] text-center mt-5 font-[popSemiBold]">Analyzing Prescription</Text>
      </View>
    )
  }

  // console.log("hello",data)

  return (


    <> 
      <SafeAreaView className="bg-[#03001C] h-full flex flex-col px-4 py-2" >
      <FlatList  
        data = {data.medicines}
        keyExtractor={(item,index)=>index.toString()}
        renderItem={({ item, index }) => (
          <Card key={index} data={item} handleEdit={handleEdit} handleDelete={handleDelete} />
        )}
        ListHeaderComponent={() => (
          <View className="flex text-left my-6 px-4 space-y-6">
            <Text className="text-white text-3xl">Hello, Recipient</Text>
          </View>
        )}
      />
      </SafeAreaView>
      <StatusBar backgroundColor='#161622' style='light' />
    </>
  );
}

