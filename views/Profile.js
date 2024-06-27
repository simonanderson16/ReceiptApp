import { Image, SafeAreaView, StyleSheet, View } from "react-native"
import React, { useEffect, useState } from "react"
import { auth } from "../firebase/firebaseConfig"
import { signOut } from "firebase/auth"
import { Button, Text, Layout, Spinner } from "@ui-kitten/components"
import { getUserInfo } from "../firebase/firebaseUtils"
import EditProfile from "../components/EditProfile"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const Profile = () => {
	const [loading, setLoading] = useState(true)
	const [userInfo, setUserInfo] = useState({})
	const [editing, setEditing] = useState(false)

	useEffect(() => {
		getUserInfo(auth.currentUser.uid).then((data) => {
			setUserInfo(data)
			setLoading(false)
		})
	}, [])

	return (
		<Layout style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				{loading ? (
					<Spinner size="giant" />
				) : editing ? (
					<EditProfile userInfo={userInfo} setUserInfo={setUserInfo} setEditing={setEditing} setLoading={setLoading} />
				) : (
					<>
						<Button style={styles.editButton} onPress={() => setEditing(true)}>
							Edit
						</Button>
						{userInfo.profilePic ? (
							<Image source={{ uri: userInfo.profilePic }} style={styles.profilePic} />
						) : (
							<Image source={require("../assets/defaultProfilePic.jpg")} style={styles.profilePic} />
						)}
						<Text category="h2">
							{userInfo.firstName} {userInfo.lastName}
						</Text>
						<Text style={styles.userName}>@{userInfo.userName}</Text>
						<Button style={styles.button} status="danger" onPress={() => signOut(auth)}>
							Logout
						</Button>
					</>
				)}
			</SafeAreaView>
		</Layout>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 160,
		alignItems: "center",
	},
	editButton: {
		position: "absolute",
		right: 24,
		top: 64,
	},
	profilePic: {
		width: 160,
		height: 160,
		borderRadius: 80,
		marginTop: 160,
		marginBottom: 8,
	},
	button: {
		marginTop: 100,
		width: 200,
		alignSelf: "center",
	},
	horizontalButtons: {
		alignItems: "center",
		marginVertical: 20,
		flexDirection: "row",
		gap: 16,
	},
	previewImage: {
		width: 240,
		height: 240,
		borderRadius: 120,
		marginVertical: 10,
	},
})

export default Profile
