
export interface UserDetails {
  _id: string;
  name: string;
  email: string;
  dp?: string;
  bio?: string;
  online?: boolean;
  nickname?:string;
  phone?:string;
  dob?:string;
  address?:string
  gender?:string
}
// export interface ProfileUser extends UserDetails {
//   followers: UserDetails[];
//   following: UserDetails[];
//   posts: Post[];
// }

export interface AuthState {
  user: UserDetails | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
}


export interface Post {
    _id: string;
    userId: {
        _id: string;
        name: string;
        dp: string;
    };
    description?: string;
    imageUrl?: string;
    publicId?: string;
  likes: {
    _id: string;
    name: string;
    dp: string;
  }[];
  comments: {
    _id: string;
    name: string;
    dp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
export interface SearchedUser extends UserDetails {}

export interface IdProp{
  id:string
}


export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  message?: string;
  image?: string;
  video?: string;
  file?: string;
  audio?: string;
  isEdited: boolean;
  isDeleted: boolean;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessagePayload {
  senderId: string;
  receiverId: string;
  message?: string;
  image?: string;
  video?: string;
  audio?: string;
  file?: string;
}


export interface ConversationDetails{
  _id:string;
  senderId:string;
  receiverId:UserDetails;
  lastMessage:string;
  lastMessageSeen:boolean;
  updatedAt:string;
  createdAt:string;

}