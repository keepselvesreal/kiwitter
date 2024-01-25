import { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  TextField,
  Button,
  styled
} from '@mui/material';


interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

const ChatContainer = styled('div')(({ theme }) => ({
  flexGrow: 1,
  marginTop: theme.spacing(8),
  height: `calc(100vh - ${theme.spacing(8)})`,
  overflow: 'hidden',
}));

const MessageInputContainer = styled('div')(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  width: '50%',
  margin: "0 auto",
  padding: theme.spacing(1),
  background: theme.palette.background.paper,
}));

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!newMessage.trim()) return;
    const timestamp = new Date().toISOString();
    setMessages([...messages, { sender: 'User', content: newMessage, timestamp }]);
    setNewMessage('');
  };

  const formatTimeStamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
  };

  return (
    <>
      <ChatContainer>
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="User Image" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    <Typography component="span" variant="body1" color="text.primary" sx={{ fontWeight: 600 }}>
                      {msg.sender}
                    </Typography>
                    <Typography component="span" variant="caption" color="textSecondary">
                      {' at '}
                      {formatTimeStamp(msg.timestamp)}
                    </Typography>
                  </>
                }
                secondary={
                  <Typography component="span" variant="body2" color="text.primary">
                    {msg.content}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </ChatContainer>

      <MessageInputContainer>
        <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex' }}>
          <TextField
            fullWidth
            multiline
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            sx={{ mr: 1 }}
          />
          <Button variant="contained" color="primary" type="submit">
            Send
          </Button>
        </Box>
      </MessageInputContainer>
    </>
  );
};

export default Chat;
