import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, InputBase, Paper, Toolbar, CssBaseline, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search'; // 검색 아이콘 추가
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LogoutIcon from '@mui/icons-material/Logout';
import { auth } from "../firebase";
import localImage from '../../public/dragon.png';

const drawerWidth = 240;

export default function Layout() {
    const navigate = useNavigate();

    const onLogOut = async () => {
        const ok = confirm("Are you sure you want to log out?");
        if (ok) {
            await auth.signOut();
            navigate("/login");
        }
    };

    const searchStyle = {
        borderRadius: '20px',
        backgroundColor: '#f1f3f4',
        marginLeft: '10px',
        width: 'auto',
        display: 'flex',
        alignItems: 'center',
        padding: '2px 20px',
    };

    // 스크롤 바 숨기기 스타일 정의
    const hiddenScrollbarStyle = {
        overflowY: 'auto', // 스크롤 가능하게 설정
        '&::-webkit-scrollbar': {
            display: 'none',
        },
        '-ms-overflow-style': 'none', // IE와 Edge를 위한 설정
        'scrollbar-width': 'none', // Firefox를 위한 설정
    };

    return (
        <>
            <CssBaseline />
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', // 변경: 가로축을 중심으로 아이템들을 중앙에 배치
                backgroundColor: '#C9E14F',
                width: "100%",
                minHeight: '100vh',
px: 3, // 변경: 좌우 패딩을 20px에서 3으로 조정
                // overflow: 'auto' // Allows for scrolling if content overflows
                ...hiddenScrollbarStyle,
                 }}>
                <Box sx={{ width: drawerWidth, flexShrink: 0 }}>
                    <Drawer
                        variant="permanent"
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
                                boxSizing: 'border-box',
                                bgcolor: ' #A36C43',
                                color: 'white',
                                borderRight: '1px solid #474a4d',
                                ...hiddenScrollbarStyle,
                            },
                        }}
                    >
                        <Toolbar>
                            <IconButton edge="start" color="inherit" aria-label="logo">
                                <img src={localImage} alt="Logo" style={{ width: '50px', height: '50px' }} />
                                {/* <LogoIcon />  */}
                            </IconButton>
                            <IconButton color="inherit" aria-label="notifications">
                                <NotificationsIcon /> {/* 알림 아이콘 */}
                            </IconButton>
                        </Toolbar>
                        <List>
                            <ListItem>
                                <Paper component="form" sx={searchStyle}>
                                    <InputBase
                                        sx={{ ml: 1, flex: 1 }}
                                        placeholder="Search Twitter"
                                        inputProps={{ 'aria-label': 'search twitter' }}
                                    />
                                    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                                        <SearchIcon />
                                    </IconButton>
                                </Paper>
                            </ListItem>
                            {/* ... 여기에 다른 리스트 아이템들 ... */}
                            <ListItem button key="Home" component={Link} to="/">
                        <ListItemIcon sx={{ color: 'white' }}><HomeIcon /></ListItemIcon>
                        <ListItemText primary="Home" />
                        </ListItem>
                        {/* ... 여기에 다른 리스트 아이템들 ... */}
                        {/* ... 나머지 리스트 아이템 ... */}
                        <ListItem button key="Bookmarks" component={Link} to="/bookmarks">
                            <ListItemIcon sx={{ color: 'white' }}><BookmarkIcon /></ListItemIcon>
                            <ListItemText primary="Bookmarks" />
                        </ListItem>
                        <ListItem button key="Chat" component={Link} to="/chat">
                            <ListItemIcon sx={{ color: 'white' }}><MessageIcon /></ListItemIcon>
                            <ListItemText primary="Chat" />
                        </ListItem>
                        {/* ... 나머지 리스트 아이템 ... */}
                        <ListItem button key="Profile" component={Link} to="/profile">
                            <ListItemIcon sx={{ color: 'white' }}><AccountCircleIcon /></ListItemIcon>
                            <ListItemText primary="Profile" />
                        </ListItem>
                        <ListItem button key="More" component={Link} to="/more">
                            <ListItemIcon sx={{ color: 'white' }}><MoreHorizIcon /></ListItemIcon>
                            <ListItemText primary="More" />
                        </ListItem>
                            <ListItem button onClick={onLogOut}>
                                <ListItemIcon sx={{ color: 'tomato' }}>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText primary="Log Out" />
                            </ListItem>
                        </List>
                    </Drawer>
                </Box>
                <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }}>
                    <Outlet />
                </Box>
                <Drawer
                    variant="permanent"
                    anchor="right" // 오른쪽에 위치
                    sx={{
                        width: drawerWidth,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            bgcolor: ' #A36C43', // 구분되는 색상 적용
                            borderLeft: '1px solid #474a4d',
                            p: 2, // 내부 패딩
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            ...hiddenScrollbarStyle,
                        },
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2, p: 2, borderRadius: 1, width: '100%', textAlign: 'center' }}>
                        회원 추천
                    </Typography>
                    {/* '회원 추천' 섹션 내부 세부 컴포넌트 */}
                    <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mb: 2, width: '150px', textAlign: 'center' }}>
                        <Typography variant="body1">리강인</Typography>
                        <Typography variant="body1">손예지</Typography>
                    </Box>
                    <Typography variant="h6" sx={{ mb: 2, p: 2, borderRadius: 1, width: '100%', textAlign: 'center' }}>
                        트렌드
                    </Typography>
                    {/* '트렌드' 섹션 내부 세부 컴포넌트 */}
                    <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 , mb: 2, width: '150px', textAlign: 'center'}}>
                        <Typography variant="body1">LangChain</Typography>
                        <Typography variant="body1">전독시</Typography>
                        {/* ...기타 세부 컴포넌트... */}
                    </Box>
                </Drawer>
            </Box>
        </>
    );
}







