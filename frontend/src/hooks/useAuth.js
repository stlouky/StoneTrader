import { useState, useEffect } from 'react';

export function useAuth() {
    const [authStatus, setAuthStatus] = useState({
        authenticated: false,
        connected: false,
        accounts: [],
        loading: true
    });
    
    useEffect(() => {
        checkAuthStatus();
        
        // Check for auth callback
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('auth') === 'success') {
            setTimeout(checkAuthStatus, 1000);
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);
    
    const checkAuthStatus = async () => {
        try {
            const response = await fetch('/auth/status', { credentials: 'include' });
            const status = await response.json();
            
            // Ensure accounts is always an array
            const safeStatus = {
                authenticated: status.authenticated || false,
                connected: status.connected || false,
                accounts: Array.isArray(status.accounts) ? status.accounts : [],
                loading: false
            };
            
            console.log('Auth status:', safeStatus);
            setAuthStatus(safeStatus);
        } catch (error) {
            console.error('Auth check failed:', error);
            setAuthStatus({ 
                authenticated: false, 
                connected: false, 
                accounts: [], 
                loading: false 
            });
        }
    };
    
    const login = () => {
        window.location.href = '/auth/login';
    };
    
    const logout = async () => {
        try {
            await fetch('/auth/logout', { 
                method: 'POST', 
                credentials: 'include' 
            });
            setAuthStatus({ 
                authenticated: false, 
                connected: false, 
                accounts: [], 
                loading: false 
            });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
    
    return {
        ...authStatus,
        login,
        logout,
        refresh: checkAuthStatus
    };
}
