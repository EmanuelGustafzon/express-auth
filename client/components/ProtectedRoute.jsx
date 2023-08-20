import axios from "axios";
import React, { useState } from 'react';

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
                console.log(error);
            }
        }
    };

    getProtectedData();

    return (
        <div>
            {protectedData ? (
                <div>{protectedData} protected data</div>
            ) : (
                <p>Loading protected data...</p>
            )}
        </div>
    );
};

export default ProtectedRoute;
