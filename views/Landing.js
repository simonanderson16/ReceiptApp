import React, { useState } from "react"
import { View, SafeAreaView, StyleSheet, Alert, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView } from "react-native"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase/firebaseConfig"
import { Button, Input, Text } from "@ui-kitten/components"
import { Ionicons } from "@expo/vector-icons"
import { addUser } from "../firebase/firebaseUtils"

const Landing = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [isSignUp, setIsSignUp] = useState(false)
	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [userName, setUserName] = useState("")
	const [secureTextEntry, setSecureTextEntry] = useState(true)

	const toggleSecureEntry = () => {
		setSecureTextEntry(!secureTextEntry)
	}

	const renderIcon = (props) => (
		<TouchableWithoutFeedback onPress={toggleSecureEntry}>
			{secureTextEntry ? <Ionicons name="eye-off" size={24} color="black" /> : <Ionicons name="eye" size={24} color="black" />}
		</TouchableWithoutFeedback>
	)

	const handleSignIn = () => {
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user
				Alert.alert("Success", `Welcome back ${user.email}`)
			})
			.catch((error) => {
				Alert.alert("Error", error.message)
			})
	}

	const handleSignUp = () => {
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user
				const email = user.email
				const uid = user.uid
				addUser({ uid, data: { email, firstName, lastName, userName } })
				Alert.alert("Success", `Account created for ${user.email}`)
			})
			.catch((error) => {
				Alert.alert("Error", error.message)
			})
	}

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
				<ScrollView contentContainerStyle={styles.scrollView}>
					<Text style={styles.title}>SplitCheck</Text>
					<Text style={styles.subtitle}>
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
						<Text style={styles.switchLink} onPress={() => setIsSignUp(!isSignUp)}>
							{isSignUp ? "Sign In" : "Sign Up"}
						</Text>
					</Text>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
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
	},
	container: {
		flex: 1,
		justifyContent: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 16,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 16,
		marginBottom: 32,
		textAlign: "center",
		color: "gray",
	},
	inputContainer: {
		width: "80%",
		alignSelf: "center",
	},
	input: {
		height: 40,
		borderWidth: 1,
		marginBottom: 12,
		paddingHorizontal: 8,
		width: "100%",
	},
	button: {
		marginHorizontal: 16,
		marginVertical: 16,
		width: "50%",
		alignSelf: "center",
	},
	switchText: {
		textAlign: "center",
		marginTop: 16,
	},
	switchLink: {
		color: "#3366FF",
	},
})

export default Landing
