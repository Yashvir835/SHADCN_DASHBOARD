import React from 'react';

function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-600">Hi, this is the Kanban page</h1>
        <p className="text-lg text-gray-700 mb-4">Wait</p>
        <h1 className="text-2xl font-semibold text-red-500">Work in progress</h1>
      </div>
    </div>
  );
}

export default Page;