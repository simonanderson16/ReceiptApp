import React, { useState } from "react"
import { View, SafeAreaView, StyleSheet, Alert, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView } from "react-native"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase/firebaseConfig"
import { Layout, Button, Input, Text, useTheme } from "@ui-kitten/components"
import { Ionicons } from "@expo/vector-icons"
import { addUser, firebaseErrorToString, userNameExists } from "../firebase/firebaseUtils"

const Landing = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [isSignUp, setIsSignUp] = useState(false)
	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [userName, setUserName] = useState("")
	const [secureTextEntry, setSecureTextEntry] = useState(true)
	const theme = useTheme()

	const toggleSecureEntry = () => {
		setSecureTextEntry(!secureTextEntry)
	}

	const renderIcon = () => (
		<TouchableWithoutFeedback onPress={toggleSecureEntry}>
			{secureTextEntry ? (
				<Ionicons name="eye-off" size={24} color={theme["color-primary-default"]} />
			) : (
				<Ionicons name="eye" size={24} color={theme["color-primary-default"]} />
			)}
		</TouchableWithoutFeedback>
	)

	const handleSignIn = () => {
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user
				Alert.alert("Success", `Welcome back ${user.email}`)
			})
			.catch((error) => {
				Alert.alert("Error", firebaseErrorToString(error))
			})
	}

	const handleSignUp = async () => {
		if (await userNameExists(userName)) {
			Alert.alert("Username already exists", "Please choose a different username.")
			return
		}
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user
				const email = user.email
				const uid = user.uid
				addUser({ uid, data: { email, firstName: firstName.strip(), lastName: lastName.strip(), userName: userName.strip() } })
				Alert.alert("Success", `Account created for ${user.email}`)
			})
			.catch((error) => {
				Alert.alert("Error", firebaseErrorToString(error))
			})
	}

	return (
		<Layout style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
					<ScrollView contentContainerStyle={styles.scrollView}>
						<Text category="h1" style={styles.title}>
							SplitCheck
						</Text>
						<Text category="c1" style={styles.subtitle}>
							{isSignUp ? "Please create your account with an email and password" : "Please enter your email and password to sign in"}
						</Text>
						<View style={styles.inputContainer}>
							{isSignUp && (
								<>
									<Input status="primary" style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
									<Input status="primary" style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
									<Input status="primary" style={styles.input} placeholder="Username" value={userName} onChangeText={setUserName} />
								</>
							)}
							<Input
								status="primary"
								style={styles.input}
								placeholder="Email"
								value={email}
								onChangeText={setEmail}
								keyboardType="email-address"
								autoCapitalize="none"
								autoCorrect={false}
							/>
							<Input
								status="primary"
								style={styles.input}
								placeholder="Password"
								accessoryRight={renderIcon}
								value={password}
								onChangeText={setPassword}
								secureTextEntry={secureTextEntry}
							/>
							<Button style={styles.button} onPress={isSignUp ? handleSignUp : handleSignIn}>
								{isSignUp ? "Create Account" : "Sign In"}
							</Button>
						</View>
						<Text style={styles.switchText}>
							{isSignUp ? "Already have an account? " : "Don't have an account? "}
							<Text appearance="hint" onPress={() => setIsSignUp(!isSignUp)}>
								{isSignUp ? "Sign In" : "Sign Up"}
							</Text>
						</Text>
					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</Layout>
	)
}

const styles = StyleSheet.create({
	keyboardAvoidingView: {
		flex: 1,
		justifyContent: "center",
	},
	scrollView: {
		flexGrow: 1,
		paddingTop: 160,
		paddingHorizontal: 16,
		paddingBottom: 32,
		alignItems: "center",
	},
	container: {
		flex: 1,
		justifyContent: "center",
	},
	inputContainer: {
		width: "80%",
		alignSelf: "center",
	},
	title: {
		marginBottom: 16,
	},
	subtitle: {
		marginBottom: 32,
	},
	input: {
		marginBottom: 12,
	},
	button: {
		marginVertical: 16,
		width: "50%",
		alignSelf: "center",
	},
	switchText: {
		textAlign: "center",
		marginTop: 16,
	},
})

export default Landing
