import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, updateDoc, getDoc, doc, setDoc, Timestamp } from "firebase/firestore";
import { deleteObject, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography,
    TextField,
    Button,
    IconButton,
    Menu,
    MenuItem,
    CardMedia
  } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar'; // Avatar 컴포넌트 임포트
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { commonStyles } from "../styles/commonStyles";


export default function Tweet({ username, photo, tweet, userId, id, onBookmarkToggle }: ITweet) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTweet, setEditedTweet] = useState(tweet);
    const [newPhoto, setNewPhoto] = useState<File | null>(null); 
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const user = auth.currentUser;
    const onDelete = async () => {
        const ok = confirm("Are you sure you want to delete this tweet?");
        if (!ok || user?.uid !== userId) return;
        try {
            await deleteDoc(doc(db, "tweets", id));
            if (photo) {
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
                await deleteObject(photoRef);
            }
        } catch (e) {
            console.log(e);
        } finally {
            //
        }
        handleClose();
    };

    const onEdit = () => {
        setIsEditing(true);
        handleClose();
    };

    const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length === 1) {
            setNewPhoto(files[0]);
        }
    };
    
    const saveEdit = async () => {
        let photoURL = photo;
        if (newPhoto) {
            const photoRef = ref(storage, `tweets/${user?.uid}/${id}`);
            const uploadResult = await uploadBytes(photoRef, newPhoto);
            photoURL = await getDownloadURL(uploadResult.ref);
        }

        await updateDoc(doc(db, "tweets", id), {
            tweet: editedTweet,
            photo: photoURL
        });

        setIsEditing(false);
        setNewPhoto(null);
        handleClose(); // 필요? 그러하다면 왜?
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditedTweet(tweet); // 편집 취소 시 원래 트윗으로 초기화
    };

    useEffect(() => {
        const checkBookmark = async () => {
            const docRef = doc(db, "bookmarks", `${user?.uid}_${id}`);
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setIsBookmarked(true);
            } else {
                setIsBookmarked(false);
            }
        };

        if (user) {
            checkBookmark();
        }
    }, [user, id])

    const toggleBookmark = async () => {
        const bookmarkRef = doc(db, "bookmarks", `${user?.uid}_${id}`);
        
        if (isBookmarked) {
            await deleteDoc(bookmarkRef);
            setIsBookmarked(false);
            if (onBookmarkToggle) {
                onBookmarkToggle(); // 북마크 해제 시에만 호출
            }
        } else {
            await setDoc(bookmarkRef, {
                userId: user?.uid,
                tweetId: id,
                createAt: Timestamp.now()
            });
            setIsBookmarked(true);
        }
    }

    return (
        // <Card sx={{ maxWidth: 600, width: "100%", mx: 'auto', my: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column'  }}>
        <Card sx={{ ...commonStyles, my: 2, overflow: 'visible' }}>
            <CardHeader
                avatar={<Avatar sx={{ bgcolor: 'silver', width: 56, height: 56 }}>G</Avatar>}
                action={
                    !isEditing && (
                        <>
                            <IconButton
                                aria-label="settings"
                                onClick={handleClick}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="long-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={onEdit}>편집</MenuItem>
                                <MenuItem onClick={onDelete}>삭제</MenuItem>
                            </Menu>
                        </>
                    )
                }
                title={
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                        {username}
                    </Typography>
                }
            />
            <CardContent>
                {!isEditing ? (
                    <Typography variant="body1" color="text.secondary">
                        {tweet}
                    </Typography>
                ) : (
                    <>
                        <TextField
                            fullWidth
                            multiline
                            value={editedTweet}
                            onChange={(e) => setEditedTweet(e.target.value)}
                            variant="outlined"
                            margin="normal"
                        />
                        <Button
                            variant="contained"
                            component="label"
                        >
                            사진 업로드
                            <input
                                type="file"
                                hidden
                                onChange={onPhotoChange}
                                accept="image/*"
                            />
                        </Button>
                    </>
                )}
            </CardContent>
            {photo && !isEditing && (
                <CardMedia
                    component="img"
                    sx={{ height: 'auto', width: '100%' }}
                    image={photo}
                    alt="Tweet photo"
                />
            )}
            <CardActions>
                {isEditing ? (
                    <>
                        <Button variant="contained" color="primary" onClick={saveEdit}>
                            저장
                        </Button>
                        <Button variant="contained" color="secondary" onClick={cancelEdit}>
                            취소
                        </Button>
                    </>
                     ): (
                        <IconButton onClick={toggleBookmark}>
                            {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </IconButton>
                        )}
            </CardActions>
        </Card>
    );
}