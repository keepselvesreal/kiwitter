interface KakaoProfile {
    nickname?: string;
    thumbnail_image_url?: string;
    profile_image_url?: string;
    is_default_image?: boolean;
}

  // TODO: 내 경우에 맞게 수정 필요
interface KakaoAccount {
    profile?: KakaoProfile;
    name?: string;
    email?: string;
    birthday?: string;
    gender?: "male" | "female";
}

export interface KakaoUser {
    id: number;
    kakao_account?: KakaoAccount;
}