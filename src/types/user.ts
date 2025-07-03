export interface UserInterface {
    fullName: string;
    username: string;
    email: string;
    password_hash: string;
}
export interface UpdateprofileInterface {
    fullName: string;
    username: string;
    gender: string;
    anonymousName: string,
    anonymousAvatar: string,
    expertise: string;
    profilePicUrl: string;
    bio: string;
    location: string;
}

export interface userOnBoardingProfileInterface {
    impression: string,
    currentEmotions: string;
    expressFellings: string;
    goals: string;
}
