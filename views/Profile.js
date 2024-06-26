import { Image, Text, SafeAreaView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, storage } from "../firebase/firebaseConfig";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { signOut } from "firebase/auth";
import { Button, Spinner } from "@ui-kitten/components";
import { getUserInfo, setProfilePic } from "../firebase/firebaseUtils";
import * as ImagePicker from "expo-image-picker";

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        getUserInfo(auth.currentUser.uid).then((data) => {
            setUserInfo(data);
            setLoading(false);
        });
    }, []);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Denied", `Sorry, we need camera roll permission to upload images.`);
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) {
                uploadPhoto(result.assets[0].uri);
            }
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
    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <Spinner size="giant" />
            ) : (
                <>
                    {userInfo.profilePic ? (
                        <Image source={{ uri: userInfo.profilePic }} style={styles.profilePic} />
                    ) : (
                        <Image source={require("../assets/defaultProfilePic.jpg")} style={styles.profilePic} />
                    )}
                    <Text style={styles.fullName}>
                        {userInfo.firstName} {userInfo.lastName}
                    </Text>
                    <Text style={styles.userName}>@{userInfo.userName}</Text>
                    <Button status="primary" onPress={() => pickImage()}>
                        {userInfo.profilePic ? "Change" : "Upload"} Profile Picture
                    </Button>
                    <Button style={styles.button} status="danger" onPress={() => signOut(auth)}>
                        Logout
                    </Button>
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    fullName: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 10,
    },
    userName: {
        fontSize: 18,
        color: "gray",
        marginTop: 4,
        marginBottom: 10,
    },
    profilePic: {
        width: 160,
        height: 160,
        borderRadius: 80,
        marginVertical: 10,
    },
    button: {
        margin: 10,
        width: 200,
        alignSelf: "center",
        position: "absolute",
        bottom: 0,
    },
});

export default Profile;
