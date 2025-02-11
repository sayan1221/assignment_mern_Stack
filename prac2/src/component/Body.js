import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { FaThumbsUp, FaComment, FaShare, FaUser, FaTimes, FaTrash, FaPlus } from 'react-icons/fa';
import pizza from './image/pizza.jpeg'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const BlogHome = () => {

    // Use state section ...
    const [sortOption, setSortOption] = useState('latest');
    const [likedPosts, setLikedPosts] = useState({});
    const [commentInput, setCommentInput] = useState({});
    const [comments, setComments] = useState({});
    const [showComments, setShowComments] = useState({});
    const [blogPopup, setBlogPopup] = useState(false);
    const [newBlog, setNewBlog] = useState({ title: '', description: '', image: null });
    const [blogData, setBlogData] = useState([]);
    const [imagefile, setImageFile] = useState(null);
    const navigate = useNavigate(); // For redirecting 
    const [userEmail, setUserEmail] = useState('');


    // main rendring ...........
    useEffect(() => {

        fetch_blog();
        GetUsersEmail();
    }, [commentInput, newBlog, sortOption,blogPopup]);

    const fetch_blog = async () => {
        try {
            const token = localStorage.getItem("token");
            // console.log("Token:", token);
            if (!token) {
                console.error("No token found. Please log in.");
                navigate('/login');
                return;
            }
            const response = await axios.get("http://localhost:5000/auth/fetch_blog", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            // const data = await response.json();
            if (!response.data || response.data.length === 0) {
                console.error("Blog not found ", response.data);
                return;
            }
            let sortedBlogs = response.data;
            // Apply sorting logic
            if (sortOption === "latest") {
                sortedBlogs = sortedBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else if (sortOption === "comments") {
                sortedBlogs = sortedBlogs.sort((a, b) => b.comments.length - a.comments.length);
            }
            setBlogData(sortedBlogs);
        } catch (e) {
            console.error('Blog fetching Error', e);
        }
    }

    const GetUsersEmail = async () => {
        try {
            const token = localStorage.getItem("token");
            // console.log("Token:", token);
            if (!token) {
                console.error("No token found. Please log in.");
                navigate('/login');
                return;
            }
            const response = await axios.get("http://localhost:5000/auth/fetch_email", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            if (!response.data || response.data.length === 0) {
                console.error("Email not found ", response.data);
                return;
            }
            setUserEmail(response.data);
        } catch (e) {
            console.error('Email fetching Error', e);
        }
    }

    const handleSortChange = (option) => {
        setSortOption(option);
    };

    // const toggleLike = async (blogID) => {
    //     try {
    //         const token = localStorage.getItem("token");
    //         // console.log("Token:", token);
    //         if (!token) {
    //             console.error("No token found. Please log in.");
    //             navigate('/login');
    //             return;
    //         }
    //         const response = await axios.post("http://localhost:5000/auth/add_like", 
    //         {blogID}, 
    //         {
    //             headers: { Authorization: `Bearer ${token}` },
    //             withCredentials: true,
    //         });
    //         console.log("Like added:", response.data);
    //         setLikedPosts((prev) => ({ ...prev, [blogID]: !prev[blogID] }));
    //     } catch (e) {
    //         console.error('Like add Error', e);
    //     }
    //     setLikedPosts((prev) => ({ ...prev, [blogID]: !prev[blogID] }));
    // };




    const handleCommentSubmit = async (blogId) => {
        // console.log("commentInput",commentInput[blogId])
        if (!commentInput[blogId]) return;
        try {
            const token = localStorage.getItem("token"); // Get user token
            // console.log("Sending Token:", token); // Debugging
            if (!token) {
                console.error("No token found. Please log in.");
                navigate('/login');
                return;
            }
            const response = await axios.post(
                "http://localhost:5000/auth/add_comment",
                {
                    blogId,
                    comment: commentInput[blogId]
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                }
            );
            console.log("Comment added:", response.data);
            toast.success("Comment added successfully!", { position: "top-right" });
            setCommentInput((prev) => ({ ...prev, [blogId]: "" }));
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Failed to add comment", { position: "top-right" });
        }
    };

    const handleCommentDelete = async (blogId, commentId) => {
        console.log("Attempting to delete comment:", { blogId, commentId });
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Please log in.");
                return;
            }
            const response = await axios.delete(`http://localhost:5000/auth/delete_comment/${blogId}/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            // console.log("Comment deleted:", response.data);
            toast.success("Comment delete successfully!", { position: "top-right" });
            fetch_blog();
        } catch (error) {
            console.error("Error deleting comment:", error);
            toast.error("Failed to delete comment!", { position: "top-right" });
        }
    };

    const handleNewBlogChange = (e) => {
        const { name, value } = e.target;
        setNewBlog((prev) => ({ ...prev, [name]: value }));
    };

    // Function to Convert Image to Base64
    // const convertToBase64 = (file) => {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = () => resolve(reader.result);
    //         reader.onerror = (error) => reject(error);
    //     });
    // };

    const handleImageUpload = async (e) => {
        // setNewBlog((prev) => ({ ...prev, image: e.target.files[0] }));
        // console.log("image url",newBlog.image);
    };


    const handleAddBlog = async () => {
        // console.log('New Blog:', newBlog);
        const token = localStorage.getItem("token"); // Get stored token
        // console.log("Token being sent:", token); // Debugging step
        if (!token) {
            console.error("User is not authenticated");
            return;
        }
        // Ensure `image` is a string
        // const imageUrl = typeof newBlog.image.name !== "" ? newBlog.image : "";
        // let imageUrl = ""; // Default empty image
        // Convert image file to Base64 if a file is selected
        // if (newBlog.image instanceof File) {
        //     const reader = new FileReader();
        //     reader.readAsDataURL(newBlog.image);
        //     reader.onloadend = async () => {
        //         imageUrl = reader.result;  // Base64 string
        //         // await sendBlogData(imageUrl); // Call function to send data
        //     };
        // } else {
        //     imageUrl = ""; // If no file, send an empty string
        // }

        console.log("Blog Data Sent:", {
            title: newBlog.title,
            description: newBlog.description,
            // image: imageUrl
        });
        try {
            const response = await axios.post("http://localhost:5000/auth/add_blog", {
                title: newBlog.title,
                description: newBlog.description,
                // image: imageUrl
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` // Ensure token is sent correctly
                },
            });
            console.log('Response:', response.data);
            toast.success("Blog Added successfully!");
            setBlogPopup(!blogPopup);
            // setBlogData(response.data.newBlog);
        } catch (e) {
            console.error('Blog adding Error', e.response?.data || e.message);
            toast.error("Failed to add blog!");
        }
    };



    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 pt-16 pb-32">
                <h1 className="text-3xl font-bold text-center mb-4">Welcome to the Blog</h1>

                {/* Sort Options */}
                <div className="flex justify-end mb-4">
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="p-2 border rounded-md"
                    >
                        <option value="latest">Sort by Latest</option>
                        <option value="comments">Sort by Most Commented</option>
                    </select>
                </div>

                {/* Blog List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {blogData.length > 0 ? (
                        blogData.map((blog) => (

                            <div key={blog._id} className="bg-white shadow-md p-4 rounded-md">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaUser className="text-gray-500" />
                                    <p className="text-gray-600">{blog.name}</p>
                                    <p className="text-gray-600 ml-12 ">{new Date(blog.date).toLocaleDateString()}</p>
                                </div>
                                <h2 className="text-xl font-semibold">{blog.blog_title}</h2>
                                <p className="mt-2 text-gray-700">{blog.blog_description}</p>
                                {/* <div className=''>
                                <img src={pizza} className='rounded-lg mt-2' />
                            </div> */}
                                <div className="flex justify-between mt-4">
                                    <button
                                        className={`text-xl ${likedPosts[blog._id] ? 'text-blue-500' : 'text-gray-500'}`}
                                    // onClick={() => toggleLike(blog._id)}
                                    >
                                        <FaThumbsUp />
                                    </button>
                                    <button
                                        className="text-xl text-green-500 relative "
                                        onClick={() => setShowComments((prev) => ({ ...prev, [blog._id]: !prev[blog._id] }))}
                                    >
                                        <FaComment />
                                        {blog.comments.length > 0 ? (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full"> {blog.comments.length}</span>
                                        ) : (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full"></span>
                                        )}
                                    </button>
                                    <button className="text-xl text-red-500">
                                        <FaShare />
                                    </button>
                                </div>

                                {/* Comments Section */}
                                {showComments[blog._id] && (
                                    <div className="mt-4 p-2 border-t max-h-32 overflow-y-auto h-32">
                                        {blog.comments.length > 0 ? (
                                            blog.comments.map((comment) => (
                                                <div key={comment._id} className="flex justify-between items-center p-2 border-b">
                                                    <p className="text-gray-700 text-sm"><strong>{comment.name}:</strong> {comment.description}</p>
                                                    {/* <button className="text-red-500 text-sm" onClick={() => handleCommentDelete(blog._id, comment._id)}>
                                                        <FaTrash />
                                                    </button> */}

                                                    {comment.email === userEmail && (
                                                        <button
                                                            className="text-red-500 text-sm"
                                                            onClick={() => handleCommentDelete(blog._id, comment._id)}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    )}


                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No comments available.</p>
                                        )}
                                    </div>
                                )}

                                {/* Comment Input */}
                                <div className="mt-2 flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Write a comment..."
                                        value={commentInput[blog._id] || ''}
                                        onChange={(e) => setCommentInput((prev) => ({ ...prev, [blog._id]: e.target.value }))}
                                        className="p-2 border rounded-md flex-1"
                                    />
                                    <button className="bg-blue-600 text-white p-2 rounded-md" onClick={() => handleCommentSubmit(blog._id)}>Post</button>
                                </div>
                            </div>
                        ))
                    )
                        : (
                            <p>No blogs available</p>
                        )}
                </div>

                {/* Add Blog Button */}
                <div className="fixed bottom-16 right-4">
                    <button className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700" onClick={() => setBlogPopup(true)}>
                        <FaPlus className='text-xl' />
                    </button>
                </div>

                {/* Add Blog Popup */}
                {blogPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-md shadow-md w-96 relative">
                            <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={() => setBlogPopup(false)}>
                                <FaTimes className='text-2xl' />
                            </button>
                            <h2 className="text-lg font-bold">Add a Blog</h2>
                            <input type="text" name="title" placeholder="Blog Title" className="w-full p-2 border rounded-md mt-2" onChange={handleNewBlogChange} />
                            <textarea name="description" placeholder="Blog Description" className="w-full p-2 border rounded-md mt-2" onChange={handleNewBlogChange} />
                            {/* <input type="file" accept="image/*" className="w-full mt-2" onChange={handleImageUpload} /> */}
                            <button className="bg-blue-600 text-white p-2 rounded-md mt-2 w-full" onClick={handleAddBlog}>Post</button>
                        </div>
                    </div>
                )}

            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default BlogHome;
