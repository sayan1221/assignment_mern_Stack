import React from 'react';
import Navbar from './Navbar';

export default function About() {
  return (
    <>
      <Navbar />
      <div className=" my-5  min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-3xl bg-white shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">About Us</h1>
          <p className="text-gray-600 leading-relaxed">
            Welcome to our platform! We are dedicated to providing insightful blogs and meaningful discussions.
            Our mission is to create a space where people can share their thoughts, learn from each other, and grow
            together. Whether you're here to write, read, or engage, we appreciate your presence.
          </p>
          <div className="mt-6">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8HjyNG7M_68VGfZhDKad8hb4zJqHc4U7aiQ&s" 
              alt="About Us" 
              className="rounded-lg shadow-md w-full h-60 object-cover"
            />
          </div>
          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700">Our Vision</h2>
            <p className="text-gray-600 mt-2">
              We strive to empower voices from different backgrounds and help build a vibrant blogging community.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
