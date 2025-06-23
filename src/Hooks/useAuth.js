import { useState, useEffect, useCallback } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, setupFirebaseAuth } from '../Config/firebase';

export const useAuth = () => {
const [user, setUser] = useState(null);
const [userId, setUserId] = useState(null);
const [userRole, setUserRole] = useState('standard');
const [profileData, setProfileData] = useState(null);
const [isAuthLoading, setIsAuthLoading] = useState(true);
const [authError, setAuthError] = useState(null);

useEffect(() => {
const unsubscribe = setupFirebaseAuth((currentUser, isLoading) => {
setIsAuthLoading(isLoading);
if (currentUser) {
setUser(currentUser);
setUserId(currentUser.uid);
fetchUserProfile(currentUser.uid);
setAuthError(null);
      } else if (!isLoading) {
setUser(null);
setUserId(null);
setUserRole('standard');
setProfileData(null);
setAuthError(null);
      }
    });

return () => unsubscribe();
  }, []);

const getProfileDocRef = (uid) => doc(db, `artifacts/${uid}/profile/${uid}`);

const fetchUserProfile = async (uid) => {
const userDocRef = getProfileDocRef(uid);
try {
const docSnapshot = await getDoc(userDocRef);
if (docSnapshot.exists()) {
const data = docSnapshot.data();
const role = (data.role && data.role.trim() !== '') ? data.role : 'standard';
setUserRole(role);
setProfileData({
phoneNumber: data.phoneNumber || '',
role,
githubProfile: data.githubProfile || '',
leetcodeProfile: data.leetcodeProfile || '',
        });
      } else {
const defaultProfile = {
role: 'standard',
phoneNumber: '',
githubProfile: '',
leetcodeProfile: '',
        };
await setDoc(userDocRef, defaultProfile);
setUserRole('standard');
setProfileData(defaultProfile);
      }
    } catch (error) {
console.error("Error fetching user profile:", error);
setAuthError(error.message);
    }
  };

const signInWithGoogle = useCallback(async () => {
setIsAuthLoading(true);
setAuthError(null);
try {
const provider = new GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');
const result = await signInWithPopup(auth, provider);
const userDocRef = getProfileDocRef(result.user.uid);
const docSnapshot = await getDoc(userDocRef);
if (!docSnapshot.exists()) {
const defaultProfile = {
name: result.user.displayName || '',
email: result.user.email || '',
role: 'standard',
phoneNumber: '',
githubProfile: '',
leetcodeProfile: '',
        };
await setDoc(userDocRef, defaultProfile);
setProfileData(defaultProfile);
setUserRole('standard');
      }
    } catch (error) {
console.error("Sign-in failed:", error);
setAuthError(error.message);
    } finally {
setIsAuthLoading(false);
    }
  }, []);

const signOutUser = useCallback(async () => {
try {
await signOut(auth);
    } catch (error) {
console.error("Sign-out failed:", error);
setAuthError(error.message);
    }
  }, []);

const updateUserProfile = useCallback(async (updates) => {
if (!userId) throw new Error("Cannot update profile: user not logged in.");
setAuthError(null);
try {
const userDocRef = getProfileDocRef(userId);
await setDoc(userDocRef, updates, { merge: true });
setProfileData(prev => ({ ...prev, ...updates }));
if (updates.role) setUserRole(updates.role);
    } catch (error) {
console.error("Error updating profile:", error);
setAuthError(error.message);
throw error;
    }
  }, [userId]);

return {
user,
userId,
userRole,
profileData,
isAuthLoading,
authError,
setAuthError,
signInWithGoogle,
signOutUser,
updateUserProfile,
  };
};