export interface joinGroupInterface {
    groupId: string;
    userId: string;
}

export interface GroupUserData {
    id: string;
    email: string;
    fullName: string;
    username: string;
    profilePicUrl: string | null;
    gender: string | null;
    bio: string | null;
    expertise: string | null;
    location: string | null;
    isVerified: boolean | null;
    joinedAt: Date | null;
}
export interface GroupUserData {
    id: string;
    email: string;
    fullName: string;
    username: string;
    profilePicUrl: string | null;
    gender: string | null;
    bio: string | null;
    expertise: string | null;
    location: string | null;
    isVerified: boolean | null;
    joinedAt: Date | null;
  }