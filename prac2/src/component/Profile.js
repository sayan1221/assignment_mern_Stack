import React, { useState, useEffect } from 'react';
import { FaUserEdit, FaBlog, FaEnvelope, FaThumbsUp, FaComment, FaShare, FaUser, FaTrash, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import pizza from './image/pizza.jpeg';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Profile = () => {
    const [likedPosts, setLikedPosts] = useState({});
    const [commentInput, setCommentInput] = useState({});
    const [comments, setComments] = useState({});
    const [showComments, setShowComments] = useState({});
    const [client, setClient] = useState(null);
    const [blogData, setBlogData] = useState([]);
    const navigate = useNavigate(); // For redirecting 
    const [userEmail, setUserEmail] = useState('');
    // console.log("client",client);
    // const token = localStorage.getItem("token");  // Get token from storage

    // console.log("blogData",blogData.length);
    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("Token:", token);

            if (!token) {
                console.error("No token found. Please log in.");
                navigate('/login');
                return;
            }
            const response = await axios.get("http://localhost:5000/auth/profile", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            // console.log("Profile data:", response.data);
            setClient(response.data);
        } catch (e) {
            console.error("Error fetching profile", e);
        }
    };

    useEffect(() => {
        fetchProfile();
        myBlog();
        GetUsersEmail();
    }, [commentInput]);


    // console.log(client);

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


    const myBlog = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Please log in.");
                navigate('/login');
                return;
            }
            const response = await axios.get("http://localhost:5000/auth/my_blog", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            // Handle empty response properly
            if (!response.data || response.data.length === 0) {
                console.error("No blogs found", response.data);
                return;
            }
            setBlogData(response.data);
            // console.log("My Blog fetch successful:", response.data);
        } catch (e) {
            console.error("Blog fetching Error", e);
        }
    };




    // LogOut....
    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove token from localStorage
        navigate("/login"); // Redirect to login page
    };


    const toggleLike = (index) => {
        setLikedPosts((prev) => ({ ...prev, [index]: !prev[index] }));
    };

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
            // console.log("Comment added:", response.data);
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
            console.log("Comment deleted:", response.data);
            toast.success("Comment deleted successfully!", { position: "top-right" });
            myBlog();
        } catch (error) {
            console.error("Error deleting comment:", error);
            toast.error("Failed to delete comment", { position: "top-right" });
        }
    };


    const handleDeleteBlog = async (blogId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Please log in.");
                navigate('/login');
                return;
            }

            const response = await axios.delete(`http://localhost:5000/auth/delete_blog/${blogId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            if (response.status === 200) {
                toast.success("Blog deleted successfully!", { position: "top-right" });
                // console.log("Blog deleted successfully");
                setBlogData(blogData.filter(blog => blog._id !== blogId)); // Remove from UI
            }
        } catch (error) {
            console.error("Error deleting blog", error);
            toast.error("Failed to delete blog", { position: "top-right" });
        }
    };


    return (
        <>
            <Navbar />
            {client ? (
                <>
                    <div className="w-full p-4 bg-white shadow-lg rounded-md mt-6">
                        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                            <img src={pizza} alt="Profile" className="w-24 h-24 rounded-full" />
                            <div>
                                <h2 className="text-2xl font-bold">{client.name}</h2>
                                <p className="text-gray-600 flex items-center gap-2 justify-center sm:justify-start">
                                    <FaEnvelope /> {client.email}
                                </p>
                                {/* <p className="text-gray-600 flex items-center gap-2 justify-center sm:justify-start">
                                    <FaEnvelope /> {client.mobile}
                                </p> */}
                            </div>
                            <button className="mt-4 sm:mt-0 sm:ml-auto bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
                                <FaUserEdit /> Edit Profile
                            </button>
                            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
                                <FaSignOutAlt /> Logout
                            </button>
                        </div>
                        <div className="mt-6 text-center sm:text-left">
                            <h3 className="text-lg font-semibold flex items-center gap-2 justify-center sm:justify-start">
                                <FaBlog /> Total Blogs: {blogData.length}
                            </h3>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                            {blogData && blogData.length > 0 ? (
                                blogData.map((blog) => (
                                    <div key={blog._id} className="bg-white shadow-md p-4 rounded-md">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaUser className="text-gray-500" />
                                            <p className="text-gray-600">{blog.name}</p>
                                            <button
                                                className="ml-auto text-red-500 hover:text-red-700 transition"
                                                onClick={() => handleDeleteBlog(blog._id)}
                                            >
                                                <FaTrash />
                                            </button>

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
                    </div>

                </>
            ) : (
                <>
                    <p className='m-20 text-xl'>Loading profile...</p>
                </>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default Profile;