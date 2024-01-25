import { useState } from "react";
// import { Button, TextField, Box, CircularProgress } from "@mui/material";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Button, TextField, Box, Avatar, IconButton, Stack, CircularProgress } from "@mui/material";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'; // 사진 추가
import { commonStyles } from "../styles/commonStyles";


export default function PostTweetForm() {
    const [isLoading, setLoading] = useState(false);
    const [tweet, setTweet] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length === 1) {
            setFile(files[0]);
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user || isLoading || tweet === "" || tweet.length > 180) return;
        setLoading(true);

        try {
            const docRef = await addDoc(collection(db, "tweets"), {
                tweet,
                createdAt: Date.now(),
                username: user.displayName || "Anonymous",
                userId: user.uid,
            });

            if (file) {
                const storageRef = ref(storage, `tweets/${user.uid}/${docRef.id}`);
                const uploadResult = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(uploadResult.ref);
                await updateDoc(docRef, { photo: url });
            }

            setTweet("");
            setFile(null);
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={onSubmit}
            sx={{
                ...commonStyles,
                p: 2,
                bgcolor: 'background.paper', // 백그라운드 색상
                borderRadius: 2, // 둥근 모서리
                boxShadow: 1, // 그림자 효과
                margin: 0,
            }}
        >
            <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar sx={{ bgcolor: 'silver', width: 56, height: 56 }}>G</Avatar>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={tweet}
                    onChange={(e) => setTweet(e.target.value)}
                    placeholder="What is happening?"
                    variant="outlined"
                    sx={{
                        width: '100%', // 부모의 100% 너비를 사용비 
                        }}
                />
            </Stack>
            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" width="100%">
                <IconButton color="primary" aria-label="add photo" component="label">
                    <input
                        accept="image/*"
                        id="file"
                        type="file"
                        hidden
                        onChange={onFileChange}
                    />
                    <AddAPhotoIcon />
                </IconButton>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    sx={{ bgcolor: '#1d9bf0', '&:hover': { bgcolor: '#1a8cd8' } }}
                >
                    {isLoading ? <CircularProgress size={24} /> : "Post"}
                </Button>
            </Stack>
        </Box>
    );
}
