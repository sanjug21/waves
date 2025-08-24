
export interface UserDetails {
  _id: string;
  name: string;
  email: string;
  dp?: string;
  bio?: string;
  online?: boolean;
}
export interface ProfileUser extends UserDetails {
  followers: UserDetails[];
  following: UserDetails[];
  posts: Post[];
}

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
    likes: string[];
    comments: string[];
    createdAt: string;
    updatedAt: string;
}

export interface SearchedUser extends UserDetails {}

export interface ProfilePageProps {
  params: {
    id: string;
  };
}

