import { User } from '@/models/user.model';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { AppDispatch } from '@/store/store';
import { setError, setLoading } from '@/store/slices/authSlice';

export async function searchUser(username:string) {
  try {
    username = username.toLowerCase();
    const usersRef = collection(db, 'Users');
    const q = query(usersRef, where('username', '>=', username),where('username' ,'<',username+'\uf8ff')); 
    const querySnapshot = await getDocs(q);

    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      users.push({ ...(doc.data() as User) });
    });

    return users;
  } catch (error) {
    console.error("Error searching user:", error);
    throw error;
  }
}


export const toggleFollowUser = async (
  dispatch: AppDispatch,
  currentUserId: string,
  profileUserId: string,
  isCurrentlyFollowing: boolean
) => {
 
  try {
    const currentUserRef = doc(db, 'Users', currentUserId);
    const profileUserRef = doc(db, 'Users', profileUserId);

    if (isCurrentlyFollowing) {
      await updateDoc(currentUserRef, {
        following: arrayRemove(profileUserId)
      });
      await updateDoc(profileUserRef, {
        followers: arrayRemove(currentUserId)
      });
      
    } else {
      await updateDoc(currentUserRef, {
        following: arrayUnion(profileUserId)
      });
      await updateDoc(profileUserRef, {
        followers: arrayUnion(currentUserId)
      });
      
    }
  } catch (error: any) {
    console.error('Error toggling follow status:', error);
    dispatch(setError(error.message || 'Failed to update follow status.'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};