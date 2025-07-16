import { db, storage } from '@/config/firebase';
import { Post } from '@/models/post.model';
import { collection, doc, DocumentData, onSnapshot, orderBy, query, QueryDocumentSnapshot, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from "uuid";

export const createPost = async ( userId: string,name:string,dp:string, description: string, imageFile: File|null): Promise<boolean> => {
 
  try {
    const postId=uuidv4();
    let postUrl='';
    if(imageFile){
      const storageRef=ref(storage,`posts/${postId}`);
    const snapshot=await uploadBytes(storageRef,imageFile);
     postUrl=await getDownloadURL(snapshot.ref);
    }
    

    const newPost:Post={
      postId,
      userId,
      description,
      name,
      dp,
      postUrl,
      likes:[],
      comments:[],
      createdAt:serverTimestamp() as any ,
      updatedAt:serverTimestamp() as any ,
    }

    const postRef=doc(db,'Posts',postId);

    await setDoc(postRef,newPost)

    return true;
   
    
  } catch (error: any) {
    console.error('Error creating post:', error);
    
    throw error;
  }
};


export const getAllPosts = (
  callback: (posts: Post[]) => void,
  onError: (error: Error) => void
) => {
  const postsCollectionRef = collection(db, 'Posts');
  const q = query(postsCollectionRef, orderBy('createdAt', 'desc')); 

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const posts: Post[] = [];
      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        posts.push({
          ...(data as Post),
          postId: doc.id, 
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt, 
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt, 
        });
      });
      callback(posts);
    },
    (error) => {
      console.error("Error streaming posts:", error);
      onError(error);
    }
  );

  return unsubscribe;
};