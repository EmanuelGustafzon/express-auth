import axios from "axios";
import React, { useState, useEffect } from 'react';

const ProtectedRoute = () => {
    const [protectedData, setProtectedData] = useState(null);

    const getProtectedData = async () => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            try {
                const response = await axios.get('https://3000-emanuelgust-expressauth-9r32l4zhkks.ws-eu104.gitpod.io/users/protected', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setProtectedData(response.data);
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    renewToken()
                } else {
                    console.log('Error accessing protected route:', error);
                }
            }
        }
    };


    const renewToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        console.log(refreshToken)
        try {
            const response = await axios.post('https://3000-emanuelgust-expressauth-9r32l4zhkks.ws-eu104.gitpod.io/users/token', {
                token: refreshToken,
            });
            const newAccessToken = response.data.accessToken;
            console.log(newAccessToken)
            await localStorage.setItem("accessToken", newAccessToken);
            window.location.reload();

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getProtectedData();
    }, []);

    return (
        <div>
            {protectedData ? (
                <div>{protectedData}</div>
            ) : (
                <p>Loading protected data...</p>
            )}
        </div>
    );
};

export default ProtectedRoute;
