import { 
    collection, 
    // getDocs, 
    limit,
    onSnapshot,
    orderBy,
    query 
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";
import { Wrapper } from "../styles/commonStyles";


export interface ITweet {
    id: string;
    photo?: string;
    tweet: string;
    userId: string;
    username: string;
    createdAt: number;
    onBookmarkToggle?: () => void;
}


export default function Timeline() {
    const [tweets, setTweet] = useState<ITweet[]>([]);
    
    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;
        const fetchTweets = async () => {
            const tweetsQuery = query(
                collection(db, "tweets"),
                orderBy("createdAt", "desc"),
                limit(25)
            );
            console.log("tweetsQuery-> ", tweetsQuery)
        unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
            const tweets = snapshot.docs.map((doc) => {
                const { tweet, createdAt, userId, username, photo } = doc.data();
                return {
                    tweet,
                    createdAt,
                    userId, 
                    username,
                    photo,
                    id: doc.id,
                };
            });
            setTweet(tweets);
        });
    };
    fetchTweets();
    return () => {
        unsubscribe && unsubscribe();
    };
    }, []);
    return (
        <Wrapper>
            {tweets.map((tweet) => (
                <Tweet key={tweet.id} {...tweet} />
            ))}
        </Wrapper>
    );
}