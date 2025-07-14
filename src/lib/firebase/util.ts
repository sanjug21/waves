import { User } from '@/models/user.model';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

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