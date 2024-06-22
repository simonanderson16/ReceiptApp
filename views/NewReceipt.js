import { useEffect, useState } from "react"
import { StyleSheet, TouchableOpacity, View, SafeAreaView } from "react-native"
import { Button, Text } from "@ui-kitten/components"
import { CameraView, useCameraPermissions } from "expo-camera"
import TakePhoto from "../components/TakePhoto"

const NewReceipt = () => {
	const [permission, requestPermission] = useCameraPermissions()
	const [photoUri, setPhotoUri] = useState(null)
	const [openTakePhoto, setOpenTakePhoto] = useState(false)

  const handleOpenTakePhoto = async () => {
    if (!permission || !permission.granted) {
      await requestPermission()
    } else {
      setOpenTakePhoto(true)
    }
  }

	const handleConfirmPhoto = (newPhotoUri) => {
		setPhotoUri(newPhotoUri)
		setOpenTakePhoto(false)
    console.log(newPhotoUri)
	}

	if (openTakePhoto) {
		return <TakePhoto handleConfirmPhoto={handleConfirmPhoto} />
	}

	return (
		<SafeAreaView style={styles.container}>
			<Text category="h1">New Receipt</Text>
			<View>
				<Button onPress={() => handleOpenTakePhoto()}>Take Photo</Button>
				<Button>Upload Photo</Button>
			</View>
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
})

export default NewReceipt
