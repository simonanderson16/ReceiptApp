import { Image, Text, SafeAreaView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { Button, Spinner } from "@ui-kitten/components";
import { getUserInfo } from "../firebase/firebaseUtils";
import EditProfile from "../components/EditProfile";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        getUserInfo(auth.currentUser.uid).then((data) => {
            setUserInfo(data);
            setLoading(false);
        });
    }, []);

    return (
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
                    <Text style={styles.header}>
                        {userInfo.firstName} {userInfo.lastName}
                    </Text>
                    <Text style={styles.userName}>@{userInfo.userName}</Text>
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
    editButton: {
        position: "absolute",
        right: 8,
        top: 48,
    },
    header: {
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
});

export default Profile;
