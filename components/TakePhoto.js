import React, { useState, useRef } from "react"
import { StyleSheet, Text, TouchableOpacity, View, Image, SafeAreaView } from "react-native"
import { CameraView } from "expo-camera"
import { Button } from "@ui-kitten/components"

const TakePhoto = ({ handleConfirmPhoto }) => {
	const [facing, setFacing] = useState("back")
	const [photoUri, setPhotoUri] = useState(null)
	const cameraRef = useRef(null)

	function toggleCameraFacing() {
		setFacing((current) => (current === "back" ? "front" : "back"))
	}

	const takePhoto = async () => {
		if (cameraRef.current) {
			const photo = await cameraRef.current.takePictureAsync()
			setPhotoUri(photo.uri)
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			{photoUri ? (
				<View style={styles.previewContainer}>
					<Image source={{ uri: photoUri }} style={styles.previewImage} />
					<View style={styles.previewActionsContainer}>
						<Button appearance="outline" onPress={() => setPhotoUri(null)}>
							Retake
						</Button>
						<Button onPress={() => handleConfirmPhoto(photoUri)}>Confirm</Button>
					</View>
				</View>
			) : (
				<CameraView style={styles.camera} type={facing} ref={cameraRef}>
					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
							<Text style={styles.text}>Flip Camera</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.button} onPress={takePhoto}>
							<Text style={styles.text}>Take Photo</Text>
						</TouchableOpacity>
					</View>
				</CameraView>
			)}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "transparent",
		margin: 64,
	},
	button: {
		flex: 1,
		alignSelf: "flex-end",
		alignItems: "center",
	},
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
	previewContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 16,
	},
	previewImage: {
		width: "80%",
		height: "80%",
		marginVertical: 32,
		resizeMode: "contain",
		borderRadius: 16,
	},
	previewActionsContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	previewActionsButton: {},
})

export default TakePhoto
