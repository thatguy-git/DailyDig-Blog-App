import React, { useState, useEffect } from 'react';
import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { useAuth } from '../constants/AuthContext';
import { FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';

const fetchComments = async ({ queryKey, pageParam = 1 }) => {
    const [, postId] = queryKey;
    const res = await fetch(
        `http://localhost:3000/api/comments/${postId}?page=${pageParam}&limit=5`
    );
    if (!res.ok) {
        throw new Error('Failed to fetch comments');
    }
    return res.json();
};

const postComment = async ({ postId, content, token }) => {
    const res = await fetch(`http://localhost:3000/api/comments/${postId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });
    if (!res.ok) {
        throw new Error('Failed to post comment');
    }
    return res.json();
};

const likeComment = async ({ commentId, token }) => {
    const res = await fetch(
        `http://localhost:3000/api/comments/${commentId}/like`,
        {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    if (!res.ok) {
        throw new Error('Failed to like comment');
    }
    return res.json();
};

const deleteComment = async ({ commentId, token }) => {
    const res = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
        throw new Error('Failed to delete comment');
    }
    return res.json();
};

const CommentSection = ({ postId }) => {
    const queryClient = useQueryClient();
    const { user, token } = useAuth();
    const [newComment, setNewComment] = useState('');

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['comments', postId],
        queryFn: fetchComments,
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasNextPage
                ? lastPage.pagination.currentPage + 1
                : undefined;
        },
    });

    const mutation = useMutation({
        mutationFn: postComment,
        onSuccess: () => {
            setNewComment(''); // Clear the input
            queryClient.invalidateQueries({ queryKey: ['comments', postId] }); // Refetch all comments
        },
    });

    const likeMutation = useMutation({
        mutationFn: likeComment,
        onMutate: async ({ commentId }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['comments', postId] });
            // Snapshot the previous value
            const previousComments = queryClient.getQueryData([
                'comments',
                postId,
            ]);

            // Optimistically update to the new value
            queryClient.setQueryData(['comments', postId], (oldData) => {
                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        data: page.data.map((comment) => {
                            if (comment._id === commentId) {
                                const isLiked = comment.likes.includes(
                                    user._id
                                );
                                return {
                                    ...comment,
                                    likes: isLiked
                                        ? comment.likes.filter(
                                              (id) => id !== user._id
                                          )
                                        : [...comment.likes, user._id],
                                    likeCount: isLiked
                                        ? comment.likeCount - 1
                                        : comment.likeCount + 1,
                                };
                            }
                            return comment;
                        }),
                    })),
                };
            });
            // Return a context object with the snapshotted value
            return { previousComments };
        },
        onError: (err, variables, context) => {
            // Rollback to the previous state on error
            queryClient.setQueryData(
                ['comments', postId],
                context.previousComments
            );
        },
        onSettled: () => {
            // Invalidate to refetch and sync with the server
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteComment,
        onSuccess: (data, { commentId }) => {
            // Manually remove the comment from the cache
            queryClient.setQueryData(['comments', postId], (oldData) => ({
                ...oldData,
                pages: oldData.pages.map((page) => ({
                    ...page,
                    data: page.data.filter(
                        (comment) => comment._id !== commentId
                    ),
                })),
            }));
        },
    });

    const handlePostComment = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            mutation.mutate({ postId, content: newComment, token });
        }
    };

    const handleLike = (commentId) => {
        likeMutation.mutate({ commentId, token });
    };

    const handleDelete = (commentId) => {
        deleteMutation.mutate({ commentId, token });
    };

    const comments = data?.pages.flatMap((page) => page.data) ?? [];

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>
            {user && (
                <form onSubmit={handlePostComment} className="mb-6">
                    <textarea
                        className="w-full p-2 border border-gray-400 outline-gray-400 rounded-sm"
                        rows="1"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                    ></textarea>
                    <button
                        type="submit"
                        className="mt-2 px-4 hover:cursor-pointer py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'Posting...' : 'Post Comment'}
                    </button>
                </form>
            )}
            {status === 'pending' ? (
                <p>Loading comments...</p>
            ) : status === 'error' ? (
                <p>Error: {error.message}</p>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div
                            key={comment._id}
                            className="flex items-start space-x-4 p-3 bg-gray-100 rounded-lg"
                        >
                            <img
                                className="w-10 h-10 rounded-full"
                                src={
                                    comment.author.profileImage?.url ||
                                    '/default-profile.png'
                                }
                                alt={comment.author.name}
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-bold">
                                        {comment.author.name}
                                    </p>
                                    {user?._id === comment.author._id && (
                                        <button
                                            onClick={() =>
                                                handleDelete(comment._id)
                                            }
                                            className="text-gray-500 hover:text-red-600"
                                            disabled={deleteMutation.isPending}
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                                <p className="text-gray-700">
                                    {comment.content}
                                </p>
                                <p className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                                    <button
                                        onClick={() => handleLike(comment._id)}
                                        disabled={likeMutation.isPending}
                                    >
                                        {comment.likes.includes(user?._id) ? (
                                            <FaHeart className="text-red-500" />
                                        ) : (
                                            <FaRegHeart />
                                        )}
                                    </button>
                                    <span>
                                        {comment.likeCount > 0 &&
                                            `${comment.likeCount} ${
                                                comment.likeCount === 1
                                                    ? 'like'
                                                    : 'likes'
                                            }`}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-4">
                {hasNextPage && (
                    <button
                        onClick={() => fetchNextPage()}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={isFetchingNextPage}
                    >
                        {isFetchingNextPage
                            ? 'Loading more...'
                            : 'Load More Comments'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
