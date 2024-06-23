import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import { auth } from '../firebaseConfig'
import { signOut } from 'firebase/auth'
import { Button } from '@ui-kitten/components'

const Profile = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile</Text>
      <Text>{auth.currentUser.email}</Text>
      <Button style={styles.button} status="danger" onPress={() => signOut(auth)}>Logout</Button>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 10,
    width: 200,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
  },
})

export default Profile