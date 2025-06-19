import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const addComment = mutation({
  args: {
    content: v.string(),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const curretUser = await getAuthenticatedUser(ctx);

    /* verify post */
    const post = await ctx.db.get(args.postId);
    if (!post) throw new ConvexError("Post not found!");
    /* create a comment */
    const commentId = await ctx.db.insert("comments", {
      userId: curretUser?._id,
      postId: args.postId,
      content: args.content,
    });

    //increment comment count by 1
    await ctx.db.patch(args.postId, { comments: post.comments + 1 });

    //create a notification if its not my post
    if (post.userId !== curretUser._id) {
      await ctx.db.insert("notifications", {
        receiverId: post.userId,
        senderId: curretUser._id,
        type: "comment",
        postId: args.postId,
        commentId,
      });
    }
    return commentId;
  },
});

export const getComments = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    const commentsWithInfo = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          user: {
            username: user!.username,
            image: user!.image,
          },
        };
      })
    );
    return commentsWithInfo;
  },
});
