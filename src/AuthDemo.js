import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://peaceful-chamber-98453-c8b3feb3fc78.herokuapp.com/auth';

const AuthDemo = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    whoAmI();
  }, []);

  const handleRequest = async (endpoint, method, body = null) => {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This ensures cookies are sent with the request
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setResponse(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      setResponse(null);
      return null;
    }
  };

  const createUser = async () => {
    const data = await handleRequest('/signup', 'POST', { email, password });
    if (data && !data.error) {
      setIsSignedIn(true);
      setCurrentUser(data);
    }
  };

  const signIn = async () => {
    const data = await handleRequest('/signin', 'POST', { email, password });
    if (data && !data.error) {
      setIsSignedIn(true);
      setCurrentUser(data);
      whoAmI(); // Check the current user after signing in
    }
  };

  const signOut = async () => {
    await handleRequest('/signout', 'POST');
    setIsSignedIn(false);
    setCurrentUser(null);
  };

  const getUser = () => handleRequest(`/${userId}`, 'GET');
  const getAllUsers = () => handleRequest('', 'GET'); // Changed this to fetch all users without a query parameter
  const removeUser = () => handleRequest(`/${userId}`, 'DELETE');
  const updateUser = () => handleRequest(`/${userId}`, 'PATCH', { email });
  
  const whoAmI = async () => {
    const data = await handleRequest('/whoami', 'GET');
    if (data && !data.error) {
      setIsSignedIn(true);
      setCurrentUser(data);
    } else {
      setIsSignedIn(false);
      setCurrentUser(null);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Auth API Demo</h1>
      
      <div className="space-y-4 mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <button onClick={createUser} className="p-2 bg-blue-500 text-white rounded">Create User</button>
        {isSignedIn ? (
          <button onClick={signOut} className="p-2 bg-red-500 text-white rounded">Sign Out</button>
        ) : (
          <button onClick={signIn} className="p-2 bg-green-500 text-white rounded">Sign In</button>
        )}
        <button onClick={getUser} className="p-2 bg-purple-500 text-white rounded">Get User</button>
        <button onClick={getAllUsers} className="p-2 bg-yellow-500 text-white rounded">Get All Users</button>
        <button onClick={removeUser} className="p-2 bg-red-700 text-white rounded">Remove User</button>
        <button onClick={updateUser} className="p-2 bg-indigo-500 text-white rounded">Update User</button>
        <button onClick={whoAmI} className="p-2 bg-pink-500 text-white rounded">Who Am I</button>
      </div>

      {isSignedIn && currentUser && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <h2 className="font-bold">Currently Signed In:</h2>
          <p>User ID: {currentUser.id}</p>
          <p>Email: {currentUser.email}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h2 className="font-bold">Error:</h2>
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold mb-2">Response:</h2>
          <pre className="whitespace-pre-wrap">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AuthDemo;