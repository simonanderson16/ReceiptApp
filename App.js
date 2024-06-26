import { auth } from "./firebase/firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"
import Landing from "./views/Landing"
import { useState, useEffect } from "react"
import * as eva from "@eva-design/eva"
import { ApplicationProvider, Spinner, Text } from "@ui-kitten/components"
import { Friends, NewReceipt, Outings, Parties, Profile } from "./views"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { FontAwesome6 } from "@expo/vector-icons"
import { Ionicons } from "@expo/vector-icons"
import { View } from "react-native"
import {useColorScheme} from 'react-native';
import { default as theme } from "./theme.json"

const Tab = createBottomTabNavigator()
const screenOptions = {
	tabBarShowLabel: true,
	headerShown: false,
	tabBarStyle: {
		backgroundColor: "#fff",
	},
}

export default function App() {
	const [signedIn, setSignedIn] = useState(false)
	const [loading, setLoading] = useState(true)
    const colorScheme = useColorScheme()

	useEffect(() => {
		setLoading(true)
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setSignedIn(true)
			} else {
				setSignedIn(false)
			}
			setLoading(false)
		})
	}, [])

	return (
		<ApplicationProvider {...eva} theme={colorScheme=== "dark" ? { ...eva.dark, ...theme } : { ...eva.light, ...theme }}>
				{loading ? (
					<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
						<Spinner size="giant" />
						<Text style={{ marginVertical: 12 }}>Loading</Text>
					</View>
				) : signedIn ? (
					<NavigationContainer>
						<Tab.Navigator screenOptions={screenOptions}>
							<Tab.Screen
								name="Outings"
								component={Outings}
								options={{
									tabBarIcon: ({ focused }) => {
										return <FontAwesome6 name="receipt" size={24} color={focused ? "black" : "gray"} />
									},
								}}
							/>
							<Tab.Screen
								name="Parties"
								component={Parties}
								options={{
									tabBarIcon: ({ focused }) => {
										return <FontAwesome6 name="people-line" size={24} color={focused ? "black" : "gray"} />
									},
								}}
							/>
							<Tab.Screen
								name="New Receipt"
								component={NewReceipt}
								options={{
									tabBarIcon: ({ focused }) => {
										return <Ionicons name="add-circle-outline" size={24} color={focused ? "black" : "gray"} />
									},
								}}
							/>
							<Tab.Screen
								name="Friends"
								component={Friends}
								options={{
									tabBarIcon: ({ focused }) => {
										return <Ionicons name="people" size={24} color={focused ? "black" : "gray"} />
									},
								}}
							/>
							<Tab.Screen
								name="Profile"
								component={Profile}
								options={{
									tabBarIcon: ({ focused }) => {
										return <Ionicons name="person" size={24} color={focused ? "black" : "gray"} />
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
