import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/auth';

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch(`${API_URL}/current-desk`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUser(data);
                    } else {
                        localStorage.removeItem('token');
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Error fetching current user:', error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        fetchCurrentUser();
    }, [API_URL]);

    const login = async (name, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);

                const userResponse = await fetch(`${API_URL}/current-desk`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${data.token}`
                    }
                });
                
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUser(userData);
                    return { success: true };
                } else {
                    return { success: false, message: 'Hiba a felhasználói adatok lekérésekor.' };
                }
            } else {
                const errorText = await response.text();
                return { success: false, message: errorText };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Hálózati hiba történt a bejelentkezés során.' };
        }
    };
    
    const addDesk = async (name, password) => {
        try {
            const response = await fetch(`${API_URL}/add-desk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, password })
            });

            if (response.ok) {
                return { success: true };
            } else {
                const errorText = await response.text();
                return { success: false, message: errorText };
            }
        } catch (error) {
            console.error('Add table error:', error);
            return { success: false, message: 'Hálózati hiba történt a regisztráció során.' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, addDesk }}>
            {children}
        </AuthContext.Provider>
    );
};
