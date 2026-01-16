// Check if token exists and is valid format
export const isValidToken = (token) => {
  if (!token) return false;
  
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Try to decode the payload (middle part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token has expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false; // Token expired
    }
    
    return true;
  } catch (error) {
    // If parsing fails, token is invalid
    return false;
  }
};

// Get token and validate it
export const getValidToken = () => {
  const token = localStorage.getItem('token');
  
  if (!isValidToken(token)) {
    // Clear invalid token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
  
  return token;
};