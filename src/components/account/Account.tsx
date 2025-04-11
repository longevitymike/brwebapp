
import React from 'react';

export default function Account() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Account Settings</h1>
      <label className="block mb-2">Name</label>
      <input className="w-full p-2 mb-4 rounded" placeholder="Your name" />
      <label className="block mb-2">Email</label>
      <input className="w-full p-2 mb-4 rounded" placeholder="you@email.com" />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
    </div>
  );
}
