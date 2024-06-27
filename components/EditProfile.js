import { View, Text, SafeAreaView, StyleSheet, Image, Alert, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from "react-native";
import { Button, Input, Divider } from "@ui-kitten/components";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../firebase/firebaseConfig";
import { setProfilePic, updateProfile } from "../firebase/firebaseUtils";

const EditProfile = ({ userInfo, setUserInfo, setEditing, setLoading }) => {
    const [selectedImage, setSelectedImage] = useState(userInfo.profilePic);
    const [selectedFirstName, setSelectedFirstName] = useState(userInfo.firstName);
    const [selectedLastName, setSelectedLastName] = useState(userInfo.lastName);
    const [selectedUserName, setSelectedUserName] = useState(userInfo.userName);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Denied", `Sorry, we need camera roll permission to upload images.`);
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri);
            }
        }
    };

    const confirmImage = async () => {
        if (selectedImage) {
            await uploadPhoto(selectedImage);
        }
    };

    const uploadPhoto = async (uri) => {
        try {
            const blob = await getBlob(uri);
            const storageRef = ref(storage, `profile_pics/${auth.currentUser.uid}`);
            await uploadBytes(storageRef, blob);
            const profilePicRef = ref(storage, `profile_pics/${auth.currentUser.uid}`);
            const profilePicURL = await getDownloadURL(profilePicRef);
            await setProfilePic(auth.currentUser.uid, profilePicURL);
            setUserInfo({ ...userInfo, profilePic: profilePicURL });
        } catch (error) {
            console.error("Upload failed: ", error);
        }
    };

    const getBlob = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
    };

    const handleConfirm = async () => {
        setLoading(true);
        await confirmImage();
        await updateProfile(auth.currentUser.uid, {
            firstName: selectedFirstName,
            lastName: selectedLastName,
            userName: selectedUserName,
        });
        setUserInfo({
            ...userInfo,
            firstName: selectedFirstName,
            lastName: selectedLastName,
            userName: selectedUserName,
        });
        setLoading(false);
        setEditing(false);
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={{ backgroundColor: "red" }}>
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <SafeAreaView style={styles.container}>
                    <Text style={styles.header}>Edit Profile</Text>
                    {userInfo.profilePic ? (
                        <Image source={{ uri: selectedImage }} style={styles.profilePic} />
                    ) : (
                        <Image source={require("../assets/defaultProfilePic.jpg")} style={styles.profilePic} />
                    )}
                    <Button status="primary" onPress={() => pickImage()} style={styles.profilePicButton}>
                        {userInfo.profilePic ? "Change" : "Upload"} Profile Picture
                    </Button>
                    <View style={styles.editRow}>
                        <Text style={styles.label}>First Name</Text>
                        <Input style={styles.editInput} value={selectedFirstName} onChangeText={(text) => setSelectedFirstName(text)} />
                    </View>
                    <View style={styles.editRow}>
                        <Text style={styles.label}>Last Name</Text>
                        <Input style={styles.editInput} value={selectedLastName} onChangeText={(text) => setSelectedLastName(text)} />
                    </View>
                    <View style={styles.editRow}>
                        <Text style={styles.label}>Username</Text>
                        <Input style={styles.editInput} value={selectedUserName} onChangeText={(text) => setSelectedUserName(text)} />
                    </View>

                    <View style={styles.bottomButtons}>
                        <Button status="danger" onPress={() => setEditing(false)}>
                            Cancel
                        </Button>
                        <Button onPress={handleConfirm}>Confirm</Button>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    editRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
        width: "80%",
    },
    label: {
        width: 80,
        marginRight: 8,
        fontWeight: "bold",
    },
    profilePicButton: {
        marginBottom: 32,
    },
    editInput: {
        flex: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 10,
    },
    profilePic: {
        width: 160,
        height: 160,
        borderRadius: 80,
        marginTop: 24,
        marginBottom: 16,
    },
    bottomButtons: {
        alignItems: "center",
        marginTop: 32,
        flexDirection: "row",
        gap: 16,
    },
});

export default EditProfile;
