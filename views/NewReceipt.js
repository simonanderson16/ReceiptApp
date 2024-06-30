import { useState } from "react"
import { StyleSheet, View, SafeAreaView, Image, TouchableOpacity } from "react-native"
import { Button, Input, Layout, Text, useTheme } from "@ui-kitten/components"
import { Ionicons } from "@expo/vector-icons"
import { useCameraPermissions } from "expo-camera"
import * as ImagePicker from "expo-image-picker"
import ImageResizer from "react-native-image-resizer"
import Camera from "../components/Camera"

import axios from "axios"
import * as FileSystem from "expo-file-system"

export default NewReceipt = () => {
	const [permission, requestPermission] = useCameraPermissions()
	const [photoUri, setPhotoUri] = useState(null)
	const [openCamera, setOpenCamera] = useState(false)
	const [title, setTitle] = useState("")
	const [loading, setLoading] = useState(false)
	const theme = useTheme()

	const handleOpenCamera = async () => {
		if (!permission || !permission.granted) {
			await requestPermission()
		} else {
			setOpenCamera(true)
		}
	}

	const handleConfirmPhoto = (newPhotoUri) => {
		setPhotoUri(newPhotoUri)
		setOpenCamera(false)
	}

	const pickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

		if (status !== "granted") {
			// If permission is denied, show an alert
			Alert.alert("Permission Denied", `Sorry, we need camera roll permission to upload images.`)
		} else {
			const result = await ImagePicker.launchImageLibraryAsync()

			if (!result.canceled) {
				setPhotoUri(result.assets[0].uri)
			}
		}
	}

	const fetchItemsFromReceipt = async (documentUri) => {
		setLoading(true)

		const apiUrl = "https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict"
		const apiKey = process.env.EXPO_PUBLIC_MINDEE_API_KEY

		try {
			const base64 = await convertUriToBase64(documentUri)

			const formData = new FormData()
			formData.append("document", base64)

			const response = await axios.post(apiUrl, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Token ${apiKey}`,
				},
			})

			console.log("Mindee API response:", response.data)
			const responseString = JSON.stringify(response.data)
			console.log(responseString)
			return response.data // Handle the response as needed in your application
		} catch (error) {
			console.error("Error predicting expense receipt:", error.response)
			throw error // Handle errors in a meaningful way for your app
		} finally {
			setLoading(false)
		}
	}

	const convertUriToBase64 = async (uri) => {
		try {
			let quality = 80
			let maxWidth = 1000
			let maxHeight = 1000
			let resizedImageUri
			let base64
			let base64Size

			const calculateBase64Size = (base64) => {
				return base64.length * (3 / 4) - (base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0)
			}

			// Iteratively resize and compress until the file size is under 10MB
			do {
				const resizedImage = await ImageResizer.createResizedImage(uri, maxWidth, maxHeight, "JPEG", quality)
				resizedImageUri = resizedImage.uri
				base64 = await FileSystem.readAsStringAsync(resizedImageUri, { encoding: FileSystem.EncodingType.Base64 })
				base64Size = calculateBase64Size(base64)

				if (base64Size > 10 * 1024 * 1024) {
					maxWidth *= 0.9
					maxHeight *= 0.9
					quality *= 0.9
				}
			} while (base64Size > 10 * 1024 * 1024)

			return base64
		} catch (error) {
			console.error("Error converting file to base64:", error)
			throw error
		}
	}

	if (openCamera) {
		return <Camera handleConfirmPhoto={handleConfirmPhoto} />
	}

	return (
		<Layout style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<Text category="h1">New Receipt</Text>
				<Input style={styles.titleInput} placeholder="Title" value={title} onChange={(newTitle) => setTitle(newTitle)} />
				{photoUri ? (
					<>
						<View style={styles.imagePreviewContainer}>
							<Image source={{ uri: photoUri }} style={styles.previewImage} />
							<TouchableOpacity onPress={() => setPhotoUri(null)} style={styles.deleteImageButton}>
								<Ionicons style={styles.closeIcon} name="close-circle" size={32} color={theme["color-basic-default"]} />
							</TouchableOpacity>
						</View>
					</>
				) : (
					<>
						<Text category="s1">You can use a photo of a receipt to start out!</Text>
						<View style={styles.photoButtons}>
							<Button style={styles.button} onPress={() => handleOpenCamera()}>
								Take Photo
							</Button>
							<Button style={styles.button} onPress={() => pickImage()}>
								Upload Photo
							</Button>
						</View>
					</>
				)}
				<Button disabled={loading} style={styles.continueButton}>Continue</Button>
			</SafeAreaView>
		</Layout>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 80,
		alignItems: "center",
	},
	titleInput: {
		width: "80%",
		marginTop: 16,
		marginBottom: 40,
	},
	photoButtons: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 16,
		marginVertical: 16,
	},
	button: {
		width: "40%",
		width: "40%",
	},
	continueButton: {
		position: "absolute",
		bottom: 32,
	},
	imagePreviewContainer: {
		position: "relative",
		width: "85%",
		height: "65%",
		padding: 16,
	},
	previewImage: {
		width: "100%",
		height: "100%",
		resizeMode: "cover",
		borderCurve: "circular",
		borderRadius: 16,
	},
	deleteImageButton: {
		position: "absolute",
		top: 0,
		right: 0,
		width: 32,
		height: 32,
	},
	closeIcon: {
		width: 32,
		height: 32,
		padding: 0,
	},
})
