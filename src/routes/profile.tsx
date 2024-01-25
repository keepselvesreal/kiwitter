import { styled } from "styled-components";
import { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
    collection, 
    getDocs,
    limit,
    orderBy,
    query,
    where,
    updateDoc
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import { Wrapper } from "../styles/commonStyles";
import { Avatar, Button, TextField } from '@mui/material';
import { styled as muiStyled } from '@mui/system';


const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const StyledAvatar = muiStyled(Avatar)({
    width: '80px', // 아바타 크기를 조정합니다.
    height: '80px', // 아바타 크기를 조정합니다.
});

const StyledButton = muiStyled(Button)({
    fontSize: '0.75rem', // 버튼의 폰트 크기를 조정합니다.
    padding: '3px 8px', // 버튼의 내부 패딩을 조정합니다.
    minWidth: '32px', // 버튼의 최소 너비를 조정합니다.
});


export default function Profile() {
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState<string | null | undefined>(user?.photoURL);
    const [username, setUsername] = useState<string>(user?.displayName || "Anonymous");
    const [editMode, setEditMode] = useState<boolean>(false);
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const onAVatarChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if ( !user ) return ;
        if (files && files.length === 1) {
            const file = files[0];
            const locationRef = ref(storage, `avatars/${user?.uid}`);
            const result = await uploadBytes(locationRef, file);
            const avatarUrl = await getDownloadURL(result.ref);
            setAvatar(avatarUrl);
            await updateProfile(user, { photoURL: avatarUrl});
        }
    };
    
    useEffect(() => {
        const fetchTweets = async () => {
            const tweetQuery = query(
                collection(db, "tweets"),
                where("userId", "==", user?.uid),
                orderBy("createdAt", "desc"),
                limit(25)
            );
            const snapshot = await getDocs(tweetQuery);
            const tweets = snapshot.docs.map((doc) => {
                const {tweet, createdAt, userId, username, photo } = doc.data();
                return {
                    tweet, 
                    createdAt,
                    userId,
                    username,
                    photo,
                    id: doc.id
                };
                });
            setTweets(tweets);
        };

        fetchTweets();
    }, [user?.uid]);
    const onUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    const saveUsername = async () => {
        if (user) {
            await updateProfile(user, { displayName: username || null });

            if (window.confirm("이전에 작성된 트윗에도 변경사항을 적용할까요?")) {
                await updateUsernameInTweets(user.uid, username);
            }
        }
        setEditMode(false);
    }

    const updateUsernameInTweets = async (userId: string, newUsername: string) => {
        const tweetsRef = collection(db, "tweets");
        const q = query(tweetsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, {username: newUsername});
        });
    };
    return (
        <Wrapper>
            <AvatarUpload htmlFor="avatar">
                <StyledAvatar src={avatar || undefined} />
            </AvatarUpload>
                
            <AvatarInput
                onChange={onAVatarChange}
                id="avatar"
                type="file"
                accept="image/*"
            />
            <Name>
                {editMode ? (
                    <div>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={username}
                            onChange={onUsernameChange}
                            margin="normal"
                        />
                        <StyledButton variant="contained" color="primary" onClick={saveUsername}>저장</StyledButton>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        {username}
                        <br />
                        <StyledButton variant="contained" color="secondary" onClick={() => setEditMode(true)}>이름 수정</StyledButton>
                    </div>
                )}
                
            </Name>
            <Tweets>
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} {...tweet} />
                ))}
            </Tweets>
        </Wrapper>
    ); 
}