import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Landing from "./views/Landing";
import { useState, useEffect } from "react";
import * as eva from "@eva-design/eva"
import { ApplicationProvider } from "@ui-kitten/components"
import { Friends, NewReceipt, Outings, Parties, Profile } from "./views"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { FontAwesome6 } from "@expo/vector-icons"
import { Ionicons } from "@expo/vector-icons"
import { AntDesign } from "@expo/vector-icons"

const Tab = createBottomTabNavigator()
const screenOptions = {
	tabBarShowLabel: true,
	headerShown: false,
	tabBarStyle: {
		backgroundColor: "#fff",
	},
}

export default function App() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSignedIn(true);
      } else {
        setSignedIn(false);
      }
    });
  }, []);

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      {signedIn ? (
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
  ) : (
    <Landing />
  )}
    </ApplicationProvider>
  )
}
