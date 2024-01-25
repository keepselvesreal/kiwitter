import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    DocumentData,
    doc
} from "firebase/firestore";

import Tweet from "../components/tweet";
import { ITweet } from "../components/timeline";
import { Wrapper } from "../styles/commonStyles";


export default function Bookmarks() {
    const [bookmarkedTweets, setBookmarkedTweets] = useState<ITweet[]>([]);
    const user = auth.currentUser;

    

    const handleBookmarkToggle = (tweetId: string) => {
        setBookmarkedTweets(bookmarkedTweets.filter(tweet => tweet.id !== tweetId));
    }

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (user) {
                const bookmarksQuery = query(collection(db, "bookmarks"), where("userId", "==", user.uid));
                const bookmarkDocs = await getDocs(bookmarksQuery);
                const tweetIds = bookmarkDocs.docs.map(doc => doc.data().tweetId);
        
                const tweets: ITweet[] = [];
                for (const tweetId of tweetIds) {
                    const tweetRef = doc(db, "tweets", tweetId);
                    const tweetSnap = await getDoc(tweetRef);
                    if (tweetSnap.exists()) {
                        const tweetData = tweetSnap.data() as DocumentData;
                        tweets.push({
                            id: tweetSnap.id,
                            tweet: tweetData.tweet,
                            userId: tweetData.userId,
                            username: tweetData.username,
                            createdAt: tweetData.createdAt,
                            photo: tweetData.photo,
                        });
                    }
                }
        
                tweets.sort((a, b) => b.createdAt - a.createdAt);
                setBookmarkedTweets(tweets);
            }
        };
        
        fetchBookmarks();
    }, [user]);


    return (
        <Wrapper>
            {bookmarkedTweets.length > 0 ? (
                bookmarkedTweets.map((tweet) => <Tweet key={tweet.id} {...tweet} onBookmarkToggle={() => handleBookmarkToggle(tweet.id)}/>)
            ) : (
                <p>No bookmarks found</p>
            )}
        </Wrapper>
    );
}
