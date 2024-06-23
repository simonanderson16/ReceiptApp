import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { Button, Spinner } from "@ui-kitten/components";
import { getUserInfo } from "../firebase/firebaseUtils";

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        getUserInfo(auth.currentUser.uid).then((data) => {
            setUserInfo(data);
            setLoading(false);
        });
    });

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <Spinner size="giant" />
            ) : (
                <>
                    <Text>Profile</Text>
                    <Text>
                        {userInfo.firstName} {userInfo.lastName}
                    </Text>
                    <Text>@{userInfo.userName}</Text>
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
    button: {
        margin: 10,
        width: 200,
        alignSelf: "center",
        position: "absolute",
        bottom: 0,
    },
});

export default Profile;
