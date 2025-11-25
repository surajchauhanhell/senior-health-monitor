import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ProtectedRoute = ({ allowedRoles }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            // 1. Check session
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                setLoading(false);
                return;
            }

            // 2. Check role if specified
            if (allowedRoles && allowedRoles.length > 0) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (profile && allowedRoles.includes(profile.role)) {
                    setIsAuthorized(true);
                }
            } else {
                // No specific role required, just login
                setIsAuthorized(true);
            }

            setLoading(false);
        };

        checkAuth();
    }, [allowedRoles]);

    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
    }

    return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
