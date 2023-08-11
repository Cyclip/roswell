import PostModel from "../db/models/PostModel.mjs";
import PostContentModel from "../db/models/PostContentModel.mjs";
import PostInteractionsModel from "../db/models/PostInteractionsModel.mjs";
import UserModel from "../db/models/UserModel.mjs";

const AGE_WEIGHT = 1;
const LIKE_WEIGHT = 3;
const COMMENT_WEIGHT = 0.5;
const SAVE_WEIGHT = 1.5;
const FOLLOW_WEIGHT = 1;

// ==================== FEED ALGORITHM ====================
// Calculate the score of a post
const calculatePostScore = (post, user) => {
    // post age in hours
    const postAge = (Date.now() - post.createdAt) / 1000 / 60 / 60;
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

    // const ageScore = 1 / Math.pow((postAge/100) + 0.4, 1.8)
    const ageScore = 1 - 5 * Math.log(0.021 * postAge + 0.43);
    const likeScore = likes * LIKE_WEIGHT + likesByFollowing * FOLLOW_WEIGHT;
    const commentScore = comments * COMMENT_WEIGHT + commentsByFollowing * FOLLOW_WEIGHT;
    const saveScore = saves * SAVE_WEIGHT;
    const score = ageScore + likeScore + commentScore + saveScore;

    // console.log(`score for post ${post.content.title} by ${post.author.username}: ${score}`);
    // console.log(`ageScore: ${ageScore}`);
    // console.log(`likeScore: ${likeScore}`);
    // console.log(`commentScore: ${commentScore}`);
    // console.log(`saveScore: ${saveScore}`);

    return score;
};

// ==================== FEED UTILITY FUNCTIONS ====================
export const getFeed = async (userId, page, limit) => {
    // make sure we parse the page and limit to integers
    page = parseInt(page);
    limit = parseInt(limit);

    // calculate the number of posts to skip
    const skip = page * limit;
    console.log(`skip: ${skip} = page: ${page} * limit: ${limit}`);

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

    // raise error if the numbre of posts is more than the limit
    if (pagedPosts.length > limit) {
        console.log("Number of posts is more than the limit", pagedPosts.length, limit, `sliced from ${skip} to ${skip + limit}`);
        throw new Error("Number of posts is more than the limit", pagedPosts.length, limit);
    }

    return {
        totalPosts: scoredPosts.length,
        posts: pagedPosts.map(item => item.post)
    };
};

