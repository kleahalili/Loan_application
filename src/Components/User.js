import fetch from 'unfetch'; // Assuming 'unfetch' is a polyfill

const checkStatus = response => {
  if (response.ok) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  return Promise.reject(error);
};

export const createUser = async user => {
  try {
    const response = await fetch('/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    await checkStatus(response); 

    const createdUser = await response.json();
    console.log('User created successfully:', createdUser);
    return createdUser; 
  } catch (error) {
    console.error('Error creating user:', error);
    throw error; 
  }
};
