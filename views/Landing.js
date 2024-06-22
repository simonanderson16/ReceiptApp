import { View, Text, Button, TextInput, SafeAreaView } from "react-native";
import { useState } from "react";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Landing = () => {
  const [phoneNumber, setPhoneNumber] = useState("8048141194");
  const appVerifier = window.recaptchaVerifier;

  const handleSignIn = () => {
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        // ...
      })
      .catch((error) => {
        // Error; SMS not sent
        // ...
      });
  };

  return (
    <SafeAreaView>
      <TextInput onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number"></TextInput>
      <Button onPress={handleSignIn} title="Sign In"></Button>
    </SafeAreaView>
  );
};

export default Landing;
