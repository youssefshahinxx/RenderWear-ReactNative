import {Image, View, Text, ImageBackground } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { images } from '@/constants/images'
import { icons } from '@/constants/icons'
import { Colors } from 'react-native/Libraries/NewAppScreen'

const TabBarIcon = ({focused, icon, title}: any) => {
  if (focused) {
  return (<ImageBackground 
    // className='flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden'
    >
    <Image 
    source={icon} 
    tintColor='#FEFEFE' className='size-8 mt-4'
    ></Image>
  </ImageBackground>
  )
} 

return (
  <View className='size-full mt-4 justify-center items-center rounded-full'>
    <Image source={icon} tintColor="#9CA4AB" className='size-7'></Image>
  </View>
)

}

const _layout = () => {
  return (
    <Tabs screenOptions={{
      tabBarShowLabel: false, 
      tabBarItemStyle: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        },
        tabBarStyle: {
          backgroundColor: '#0E0F0F',
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 40,
          height: 60,
          position: 'absolute',
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#0f0d23',
        }
      }}>
        <Tabs.Screen name="index" options={{
          headerShown: false, 
          title: "Home",
          tabBarIcon: ({focused}) => (
           <TabBarIcon 
           focused={focused}
           icon={icons.home}/> 
          )
        }}/>
        <Tabs.Screen name="modelSelection" options={{ headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabBarIcon 
            focused={focused}
            icon={icons.actor}
            /> 
          )
        }}/>
        <Tabs.Screen name="dressing" options={{ headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabBarIcon 
            focused={focused}
            icon={icons.dresser}/> 
          )
         }}/>
        <Tabs.Screen name="savedGeneration" options={{ headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabBarIcon 
            focused={focused}
            icon={icons.history}/> 
          )
        }}/>
        <Tabs.Screen name="profile" options={{ headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabBarIcon 
            focused={focused}
            icon={icons.person}/> 
          )
         }}/>
    </Tabs>
  )
}

export default _layout