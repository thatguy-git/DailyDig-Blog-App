import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { API_URL } from '../constants/links';

export const StoryForm = () => {
    const { id } = useParams();
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        selectedTags: [],
        coverImage: null,
        coverImagePreview: '',
    });
    const [publishError, setPublishError] = useState('');
    const [publishSuccess, setPublishSuccess] = useState('');

    const { data: post, isPending: isPostLoading } = useQuery({
        queryKey: ['post', id],

        queryFn: async () => {
            const response = await fetch(`${API_URL}/api/posts/${id}`);

            if (!response.ok) {
                throw new Error('Failed to fetch post');
            }

            const result = await response.json();

            return result.data;
        },

        enabled: !!id,
    });

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title || '',
                content: post.content || '',
                selectedTags: post.tags || [],
                coverImage: null,
                coverImagePreview: post.featuredImage?.url || '',
            });
        }
    }, [post]);

    const mutation = useMutation({
        mutationFn: async (data) => {
            const token = localStorage.getItem('token');

            const payload = new FormData();

            payload.append('title', data.title);

            payload.append('content', data.content);

            payload.append('tags', JSON.stringify(data.selectedTags || []));

            if (data.coverImage) payload.append('coverImage', data.coverImage);

            const url = id
                ? `${API_URL}/api/posts/${id}`
                : `${API_URL}/api/posts`;

            const method = id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,

                headers: token ? { Authorization: `Bearer ${token}` } : {},

                body: payload,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));

                throw new Error(
                    err.message || `Request failed (${res.status})`
                );
            }

            return res.json();
        },

        onSuccess: (result) => {
            setPublishSuccess(
                `Story ${id ? 'updated' : 'published'} successfully.`
            );

            setPublishError('');

            queryClient.invalidateQueries(['post', id]);

            queryClient.invalidateQueries(['posts']);

            const newId =
                result?.data?._id || result?.post?._id || result?.id || id;

            if (newId) navigate(`/post/${newId}`);
        },

        onError: (err) => {
            console.log(err);

            setPublishError(
                err.message || `Failed to ${id ? 'update' : 'publish'} story`
            );

            setPublishSuccess('');
        },
    });

    const AVAILABLE_TAGS = [
        'Technology',
        'Health',
        'Business',
        'Science',
        'Education',
        'Sports',
        'Lifestyle',
        'Politics',
        'Entertainment',
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setFormData((prev) => ({ ...prev, content: data }));
    };

    const toggleTag = (tag) => {
        setFormData((prev) => {
            if (prev.selectedTags.includes(tag)) {
                return {
                    ...prev,
                    selectedTags: prev.selectedTags.filter((t) => t !== tag),
                };
            } else {
                return { ...prev, selectedTags: [...prev.selectedTags, tag] };
            }
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                setPublishError('Image size should not exceed 10MB.');
                // Clear the file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                // Clear image state
                setFormData((prev) => ({
                    ...prev,
                    coverImage: null,
                    coverImagePreview: '',
                }));
                return; // Stop processing
            }
            const previewUrl = URL.createObjectURL(file);
            setFormData((prev) => ({
                ...prev,
                coverImage: file,
                coverImagePreview: previewUrl,
            }));
            setPublishError(''); // Clear any previous errors
        }
    };

    const removeImage = () => {
        setFormData((prev) => ({
            ...prev,
            coverImage: null,
            coverImagePreview: '',
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setPublishError('');
        setPublishSuccess('');
        if (!formData.title || !formData.content) {
            setPublishError('Title and content are required.');
            return;
        }
        mutation.mutate(formData);
    };

    if (isPostLoading && id) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  pt-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 sm:p-12">
                    <div className="mb-10 border-b border-gray-100 pb-6">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            {id ? 'Edit Your Story' : 'Write a New Story'}
                        </h1>
                    </div>
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Cover Image (Optional)
                        </label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                        {formData.coverImagePreview ? (
                            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden group">
                                <img
                                    src={formData.coverImagePreview}
                                    alt="Cover Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={removeImage}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition shadow-lg flex items-center gap-2 hover:cursor-pointer"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M3 6h18" />
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                            <path d="M8 6V4c0-1 1-1 1-1h6c1 0 1 1 1 1v2" />
                                        </svg>
                                        Remove Image
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={triggerFileInput}
                                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-teal-500 hover:text-teal-600 hover:bg-gray-50 transition-all duration-200"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mb-2"
                                >
                                    <rect
                                        width="18"
                                        height="18"
                                        x="3"
                                        y="3"
                                        rx="2"
                                        ry="2"
                                    />
                                    <circle cx="9" cy="9" r="2" />
                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                </svg>
                                <span className="text-sm font-medium">
                                    Click to add a cover image
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="mb-8">
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Give your story a title..."
                            className="block w-full text-4xl font-bold text-gray-900 placeholder-gray-300 border-none focus:ring-0 focus:outline-none px-0 py-3 bg-transparent leading-normal h-auto"
                        />
                    </div>
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_TAGS.map((tag) => {
                                const isSelected =
                                    formData.selectedTags.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleTag(tag)}
                                        className={`
                                            px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:cursor-pointer
                                            ${
                                                isSelected
                                                    ? 'bg-teal-600 text-white shadow-md transform scale-105'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }
                                        `}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="mb-8">
                        <CKEditor
                            editor={ClassicEditor}
                            data={formData.content}
                            onChange={handleEditorChange}
                        />
                    </div>
                    <div className="flex items-center justify-end gap-4">
                        <button
                            onClick={() => navigate(id ? `/post/${id}` : '/')}
                            className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors hover:cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={mutation.isPending}
                            className="px-8 py-3 bg-teal-600 text-white font-bold rounded-lg shadow-lg hover:bg-teal-700 transform transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                        >
                            {mutation.isPending
                                ? id
                                    ? 'Updating...'
                                    : 'Publishing...'
                                : id
                                ? 'Update Story'
                                : 'Publish Story'}
                        </button>
                    </div>
                    {publishError && (
                        <p className="text-red-500 mt-3">{publishError}</p>
                    )}
                    {publishSuccess && (
                        <p className="text-green-500 mt-3">{publishSuccess}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoryForm;
