import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../constants/AuthContext';

const fetchComments = async (postId, page = 1, limit = 2) => {
    const res = await fetch(
        `http://localhost:3000/api/comments/${postId}?page=${page}&limit=${limit}`
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

const CommentSection = ({ postId }) => {
    const queryClient = useQueryClient();
    const { user, token } = useAuth();
    const [page, setPage] = useState(1);
    const [newComment, setNewComment] = useState('');

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['comments', postId, page],
        queryFn: () => fetchComments(postId, page, 2),
        keepPreviousData: true,
    });

    const mutation = useMutation({
        mutationFn: postComment,
        onSuccess: () => {
            setNewComment('');
            queryClient.invalidateQueries(['comments', postId]);
        },
    });

    const handlePostComment = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            mutation.mutate({ postId, content: newComment, token });
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>
            {user && (
                <form onSubmit={handlePostComment} className="mb-6">
                    <textarea
                        className="w-full p-2 border rounded-lg"
                        rows="2"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                    ></textarea>
                    <button
                        type="submit"
                        className="mt-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                        disabled={mutation.isLoading}
                    >
                        {mutation.isLoading ? 'Posting...' : 'Post Comment'}
                    </button>
                </form>
            )}
            {isLoading && <p>Loading comments...</p>}
            {isError && <p>Error: {error.message}</p>}
            <div>
                {data?.data.map((comment) => (
                    <div
                        key={comment._id}
                        className="bg-slate-600 mb-2 p-2 border rounded-full pl-6"
                    >
                        <p className="font-bold">{comment.author.name}</p>
                        <p>{comment.content}</p>
                    </div>
                ))}
            </div>
            <div className="mt-4">
                {data?.pagination.hasNextPage && (
                    <button
                        onClick={() => setPage((prev) => prev + 1)}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Load More Comments
                    </button>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
