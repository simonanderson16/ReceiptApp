import { db, storage } from "./firebaseConfig"
import { ref, getDownloadURL } from "firebase/storage"
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"
import { AuthErrorCodes } from "firebase/auth"

export const addUser = async (user) => {
	try {
		const id = user.uid
		const userData = user.data
		await setDoc(doc(db, "users", id), userData)
		return true
	} catch (error) {
		console.error("Error adding user: ", error)
		return false
	}
}

export const getUserInfo = async (uid) => {
	try {
		const docRef = doc(db, "users", uid)
		const docSnap = await getDoc(docRef)
		if (docSnap.exists()) {
			return { ...docSnap.data() }
		} else {
			console.error("No such user")
			return false
		}
	} catch (error) {
		console.error("Error getting user info: ", error)
		return false
	}
}

export const setProfilePic = async (uid, uri) => {
    try {
        await updateDoc(doc(db, "users", uid), {
            profilePic: uri,
        });
        return true;
    } catch (error) {
        console.error("Error setting profile pic: ", error);
        return false;
    }
}

export const updateProfile = async (uid, data) => {
    try {
        await updateDoc(doc(db, "users", uid), data);
        return true;
    } catch (error) {
        console.error("Error updating profile: ", error);
        return false;
    }
}

//https://stackoverflow.com/questions/72998085/firestore-error-code-to-human-readable-message
export const firebaseErrorToString = (error) => {
	let msg = ""
	const code = error.code

	if (error) {
		// convert error to string in case it's not
		error = error.toString()

		// convert code to a human readable message (some messages can be found here: <https://firebase.google.com/docs/auth/admin/errors?hl=en>)
		switch (code) {
			case AuthErrorCodes.ARGUMENT_ERROR: {
				msg = "Argument error."
				break
			}
			case AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN: {
				msg = "Please logout, re-login, and try again."
				break
			}
			case AuthErrorCodes.INVALID_PASSWORD: {
				msg = "Incorrect password."
				break
			}
			case AuthErrorCodes.TOKEN_EXPIRED: {
				msg = "Your token has expired. Please logout and re-login."
				break
			}
			case AuthErrorCodes.USER_CANCELLED: {
				msg = "Login process was stopped by you."
				break
			}
			case AuthErrorCodes.USER_DELETED: {
				msg = "User does not exist."
				break
			}
			case AuthErrorCodes.USER_DISABLED: {
				msg = "Your account has been disabled."
				break
			}
			case AuthErrorCodes.USER_MISMATCH: {
				msg = "Credential given does not correspond to you."
				break
			}
			case AuthErrorCodes.USER_SIGNED_OUT: {
				msg = "You are signed out. Please re-sign in."
				break
			}
			case AuthErrorCodes.WEAK_PASSWORD: {
				msg = "Your password is too weak. It must be at least six characters long."
				break
			}
			case AuthErrorCodes.INVALID_EMAIL: {
				msg = "The email address is improperly formatted."
				break
			}
			case AuthErrorCodes.INTERNAL_ERROR: {
				msg = "Internal Error."
				break
			}
			case AuthErrorCodes.INVALID_API_KEY: {
				msg = "Invalid API key."
				break
			}
			case AuthErrorCodes.INVALID_APP_CREDENTIAL: {
				msg = "Invalid app credential."
				break
			}
			case AuthErrorCodes.INVALID_APP_ID: {
				msg = "Invalid app ID."
				break
			}
			case AuthErrorCodes.INVALID_AUTH: {
				msg = "Invalid user token."
				break
			}
			case AuthErrorCodes.TIMEOUT: {
				msg = "Authentication timeout."
				break
			}
			case AuthErrorCodes.UNVERIFIED_EMAIL: {
				msg = "Your email address is not verified. Please verify it."
				break
			}
			case AuthErrorCodes.WEB_STORAGE_UNSUPPORTED: {
				msg = "Web storage is unsupported. Please update or use a different browser."
				break
			}
			case AuthErrorCodes.ALREADY_INITIALIZED: {
				msg = "Already initialized."
				break
			}
			case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER: {
				msg =
					"Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later."
				break
			}
			default: {
				msg = `Unknown error >> code = ${code}`
				break
			}
		}
	}

	return msg
}
