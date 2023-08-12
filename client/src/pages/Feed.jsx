import FeedPostsPane from "../components/FeedPostsPane";
import FeedSidebar from "../components/FeedSidebar";

import "../styles/Feed.css";

const Feed = () => {
    return (
        <div className="feed">
            <FeedPostsPane />
            <FeedSidebar />
        </div>
    );
};

export default Feed;