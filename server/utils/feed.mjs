import PostModel from "../db/models/PostModel.mjs";
import PostContentModel from "../db/models/PostContentModel.mjs";
import PostInteractionsModel from "../db/models/PostInteractionsModel.mjs";
import UserModel from "../db/models/UserModel.mjs";

const AGE_WEIGHT = 0.1;
const LIKE_WEIGHT = 0.6;
const COMMENT_WEIGHT = 0.5;
const SAVE_WEIGHT = 0.5;
const FOLLOW_WEIGHT = 0.5;

// ==================== FEED ALGORITHM ====================
// Calculate the score of a post
const calculatePostScore = (post, user) => {
    console.log("calculating score for", post);
    const postAge = Date.now() - post.createdAt;
    const following = user ? user.following : [];

    // get likes comments and saves
    const likes = post.interactions.likes.length;
    const comments = post.interactions.comments.length;
    const saves = post.interactions.saves;

    // get change in likes comments and saves
    // skip

    // get number of interactions by user's following
    const likesByFollowing = post.interactions.likes.filter((like) => following.includes(like.user)).length;
    const commentsByFollowing = post.interactions.comments.filter((comment) => following.includes(comment.user)).length;

    // calculate score
    let score = 0;
    score += postAge * AGE_WEIGHT;
    score += likes * LIKE_WEIGHT;
    score += comments * COMMENT_WEIGHT;
    score += saves * SAVE_WEIGHT;
    score += likesByFollowing * FOLLOW_WEIGHT;
    score += commentsByFollowing * FOLLOW_WEIGHT;
    
    console.log(`score for post ${post._id}: ${score}`);

    return score;
};

// ==================== FEED UTILITY FUNCTIONS ====================
export const getFeed = async (userId, page, limit) => {
    const skip = page * limit;

    // Fetch all posts
    const allPosts = await PostModel.find({})
        .populate({ path: "content", model: PostContentModel })
        .populate({ path: "author", model: UserModel })
        .populate({ path: "interactions", model: PostInteractionsModel });

    // Calculate scores and sort posts
    const scoredPosts = allPosts.map(post => ({
        post,
        score: calculatePostScore(post, userId)
    }));
    scoredPosts.sort((a, b) => b.score - a.score); // Sort by score in descending order

    // Implement pagination using array slicing
    const pagedPosts = scoredPosts.slice(skip, skip + limit);

    return {
        totalPosts: scoredPosts.length,
        posts: pagedPosts.map(item => item.post)
    };
};

