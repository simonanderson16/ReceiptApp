import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Friends, NewReceipt, Outings, Parties, Profile } from "./tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome6 } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const screenOptions = {
  tabBarShowLabel: true,
  headerShown: false,
  tabBarStyle: {
    backgroundColor: "#fff",
  },
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen
          name="Outings"
          component={Outings}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <FontAwesome6
                  name="receipt"
                  size={24}
                  color={focused ? "black" : "gray"}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Parties"
          component={Parties}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <FontAwesome6
                  name="people-line"
                  size={24}
                  color={focused ? "black" : "gray"}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="New Receipt"
          component={NewReceipt}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <AntDesign
                  name="pluscircleo"
                  size={24}
                  color={focused ? "black" : "gray"}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Friends"
          component={Friends}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <Ionicons
                  name="people"
                  size={24}
                  color={focused ? "black" : "gray"}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <Ionicons
                  name="person"
                  size={24}
                  color={focused ? "black" : "gray"}
                />
              );
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
