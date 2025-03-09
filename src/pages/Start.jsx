import React from 'react';
import { Link } from 'react-router-dom';

function Start() {
  return (
    <div className="bg-[url('https://media.istockphoto.com/id/1323994547/photo/chic-young-asian-man-using-mobile-app-device-on-smartphone-to-order-a-taxi-pick-up-service-by.jpg?s=612x612&w=0&k=20&c=pjxnHZpX0cLZViayHDBf3Ae5UPTgY2Y6H7R-25tMi9o=')] h-screen w-full bg-red-400 flex flex-col justify-between">
      <img className="w-32 h-auto py-3 px-4"src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"alt="Uber Logo"/>
      <div className="bg-white py-5 px-6 pb-8 ">
        <h2 className="text-4xl font-bold">Get started with Uber</h2>
        <Link to="/userlogin"className="block text-center text-2xl text-white py-3 px-5 w-full rounded bg-black mt-4">Continue</Link>
      </div>
    </div>
  );
}

export default Start;
