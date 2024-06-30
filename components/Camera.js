import React, { useRef } from "react"
import { StyleSheet, TouchableOpacity, View, SafeAreaView } from "react-native"
import { CameraView } from "expo-camera"
import { Layout } from "@ui-kitten/components"

const Camera = ({ handleConfirmPhoto }) => {
	const cameraRef = useRef(null)

	const takePhoto = async () => {
		if (cameraRef.current) {
			const photo = await cameraRef.current.takePictureAsync()
			handleConfirmPhoto(photo.uri)
		}
	}

	return (
		<Layout style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<CameraView style={styles.camera} ref={cameraRef}>
					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.cameraButton} onPress={takePhoto} />
					</View>
				</CameraView>
			</SafeAreaView>
		</Layout>
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

export default Camera
