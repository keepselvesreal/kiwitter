import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, updateDoc, doc, collection } from "firebase/firestore";
import { deleteObject, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
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
import { green } from "@mui/material/colors";


const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
`;

const Column = styled.div`
    &:last-child {
        place-self: end;
    }
`;

const Photo = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 15px;
`;

const Username = styled.span`
    font-weight: 600;
    font-size: 15px;
`;

// const Payload = styled.p`
//     margin: 10px 0px;
//     font-size: 18px;
// `;
const Payload = styled.p`
    margin: 10px 0px;
    font-size: 18px;
    background-color: ${(props) => (props.isEditing ? 'black' : 'purple')}; // 여기서 kiwiColor를 원하는 색상 코드로 대체하세요
    color: white;
    padding: 10px;
    border-radius: 10px;
`;

const EditableTextarea = styled.textarea`
    width: 100%;
    // 여기에 추가 스타일링
`;


const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: skyblue;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const SaveButton = styled(EditButton)`
  background-color: green;
`;

const CancelButton = styled(EditButton)`
  background-color: red;
`;


const ButtonWrapper = styled.div`
  display: flex;
  justify-content: start;
  gap: 10px; // 버튼 사이의 간격
  margin-top: 10px; // 위쪽 여백
`;


export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTweet, setEditedTweet] = useState(tweet);
    const [newPhoto, setNewPhoto] = useState<File | null>(null); 
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
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
            const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
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

    return (
        <Card sx={{ maxWidth: 500, bgcolor: green[100], margin: 'auto', mt: 2, overflow: 'hidden' }}>
            <CardHeader
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
                title={username}
                subheader={`@${userId}`}
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
                ) : (
                    user?.uid === userId && (
                        <Button variant="contained" color="primary" onClick={onEdit}>
                            편집
                        </Button>
                    )
                )}
                {user?.uid === userId && !isEditing && (
                    <Button variant="contained" color="error" onClick={onDelete}>
                        삭제
                    </Button>
                )}
            </CardActions>
        </Card>
    );
}