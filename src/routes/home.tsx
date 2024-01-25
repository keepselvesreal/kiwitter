import PostTweetForm from "../components/post-tweet-form";
import Timeline from "../components/timeline";
import { Wrapper } from "../styles/commonStyles";


export default function Home() {
    return (
        <Wrapper>
            <PostTweetForm />
            <Timeline />
        </Wrapper>
    );
}