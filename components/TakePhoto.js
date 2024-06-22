import React, { useState, useRef } from "react"
import { StyleSheet, TouchableOpacity, View, Image, SafeAreaView } from "react-native"
import { CameraView } from "expo-camera"
import { Button, Text } from "@ui-kitten/components"

const TakePhoto = ({ handleConfirmPhoto }) => {
	const [photoUri, setPhotoUri] = useState(null)
	const cameraRef = useRef(null)

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
				<CameraView style={styles.camera} ref={cameraRef}>
					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.cameraButton} onPress={takePhoto} />
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
		justifyContent: "flex-end",
		alignItems: "center",
		marginBottom: 32,
	},
	cameraButton: {
		width: 72,
		height: 72,
		backgroundColor: "white",
		borderCurve: "circular",
		borderRadius: 72,
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
		borderCurve: "circular",
		borderRadius: 16,
	},
	previewActionsContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		rowGap: 16,
	},
})

export default TakePhoto
