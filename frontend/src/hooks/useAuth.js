import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getValidToken } from '../utils/auth';

/**
 * Custom hook to check authentication status.
 * Redirects to / (landing page) if the token is invalid or corrupted.
 * 
 * @returns {Object} - { isAuthenticated, isLoading }
 */
const useAuth = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check token validity on mount
        const token = getValidToken();

        if (!token) {
            navigate('/', { replace: true });
            return;
        }

        setIsAuthenticated(true);
        setIsLoading(false);

        // Handler for storage events (fires in OTHER tabs)
        const handleStorageChange = (e) => {
            if (e.key === 'token') {
                setTimeout(() => {
                    if (!getValidToken()) {
                        setIsAuthenticated(false);
                        navigate('/', { replace: true });
                    }
                }, 100);
            }
        };

        // Handler for custom token-changed event (same tab logout)
        const handleTokenChanged = () => {
            if (!getValidToken()) {
                setIsAuthenticated(false);
                navigate('/', { replace: true });
            }
        };

        // Interval check for same-tab token corruption (e.g., via DevTools)
        const tokenCheckInterval = setInterval(() => {
            if (!getValidToken()) {
                setIsAuthenticated(false);
                navigate('/', { replace: true });
            }
        }, 1000);

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('token-changed', handleTokenChanged);

        return () => {
            clearInterval(tokenCheckInterval);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('token-changed', handleTokenChanged);
        };
    }, [navigate]);

    return { isAuthenticated, isLoading };
};

export default useAuth;
