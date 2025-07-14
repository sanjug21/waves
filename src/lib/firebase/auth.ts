import { auth, db } from '../../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User as FirebaseUser, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { AppDispatch } from '@/store/store';
import { setLoading, setUser, clearUser, setError } from '@/store/slices/authSlice';
import { User } from '@/models/user.model';

import { loginSchema, registerSchema } from '../validation/auth.validation';
import { log } from 'console';

const mapFirebaseUserToUser = async (firebaseUser: FirebaseUser): Promise<User | null> => {
  if (!firebaseUser) return null;

  const userDocRef = doc(db, 'Users', firebaseUser.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const userData = userDocSnap.data() as User;
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      name: userData.name ?? firebaseUser.displayName ?? '',
      dp: userData.dp ?? "https://firebasestorage.googleapis.com/v0/b/chatbot-84fc1.appspot.com/o/de.png?alt=media&token=e141a658-2053-4e0a-af29-907641dd4446",
      username: userData.username ?? '',
      bio: userData.bio ?? '',
      online: userData.online ?? false,
      followers: userData.followers ?? [],
      following: userData.following ?? [],
      createdAt: (userData.createdAt as Timestamp) || Timestamp.now(),
    };
  }
  return null;
};

export const registerUser = async (dispatch: AppDispatch, email: string, password: string, name: string) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    registerSchema.parse({ email, password, name });

    await setPersistence(auth, browserSessionPersistence);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const user: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      name,
      dp: "https://firebasestorage.googleapis.com/v0/b/chatbot-84fc1.appspot.com/o/de.png?alt=media&token=e141a658-2053-4e0a-af29-907641dd4446",
      username: name.toLowerCase(),
      bio: '',
      online:true,
      followers: [],
      following: [],
      createdAt: serverTimestamp() as Timestamp,
    };

    await setDoc(doc(db, 'Users', user.uid), user);

    const userData = await mapFirebaseUserToUser(firebaseUser);
    dispatch(setUser(userData));

  } catch (error: any) {
    console.error('Error registering user:', error);
    dispatch(setError(error.message || 'An unknown error occurred.'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const loginUser = async (dispatch: AppDispatch, email: string, password: string) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    loginSchema.parse({ email, password });

    await setPersistence(auth, browserSessionPersistence);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const userData = await mapFirebaseUserToUser(firebaseUser);
    dispatch(setUser(userData));

  } catch (error: any) {
    console.error('Error logging in user:', error);
    dispatch(setError(error.message || 'An unknown error occurred.'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const logoutUser = async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));

  try {
    await signOut(auth);
    dispatch(clearUser());
    console.log('User logged out successfully');
  } catch (error: any) {
    console.error('Error logging out user:', error);
    dispatch(setError(error.message || 'An unknown error occurred.'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const authListener = (dispatch: AppDispatch) => {
  const unsubscribe = auth.onAuthStateChanged(
    async (firebaseuser) => {
      console.log('Auth state changed:', firebaseuser);
      dispatch(setLoading(true));
      if (firebaseuser) {
        const user = await mapFirebaseUserToUser(firebaseuser);
        dispatch(setUser(user));
      } else {
        dispatch(clearUser());
        
      }
      dispatch(setLoading(false));
    }
  );
  return unsubscribe;
};