import React, { useState, useEffect } from 'react';
import axios from "axios";

function StudentDashboard({ userId, onLogout }) {
    const [audios, setAudios] = useState([]);
    const [error, setError] = useState(null);
    const [hostelName, setHostelName] = useState(null);

    useEffect(() => {
        const fetchAudios = async () => {
            try {
                const hostel = await getStudentHostelName();
                if (hostel) {
                    setHostelName(hostel);
                    const response = await axios.get(`http://13.53.212.171:8081/api/audio/getForHostel/${hostel}`);

                    const audiosWithUrls = response.data.map(audio => {
                        if (audio.data && audio.data.length > 0) {
                            try {
                                const byteCharacters = atob(audio.data);
                                const byteNumbers = new Array(byteCharacters.length);
                                for (let i = 0; i < byteCharacters.length; i++) {
                                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                                }
                                const byteArray = new Uint8Array(byteNumbers);
                                const audioBlob = new Blob([byteArray], { type: 'audio/mpeg' });
                                const audioUrl = URL.createObjectURL(audioBlob);
                                return {
                                    ...audio,
                                    audioUrl: audioUrl,
                                };
                            } catch (blobError) {
                                console.error("Error creating Blob:", blobError);
                                return {
                                    ...audio,
                                    audioUrl: null,
                                };
                            }
                        } else {
                            console.error("Audio data is empty or null for audio ID:", audio.id);
                            return {
                                ...audio,
                                audioUrl: null,
                            };
                        }
                    });

                    setAudios(audiosWithUrls);
                }
            } catch (err) {
                setError(`Failed to fetch audios: ${err.message || err}`);
                console.error("Fetch Audios Error:", err);
            }
        };

        fetchAudios();
    }, [userId]);

    const getStudentHostelName = async () => {
        try {
            const response = await axios.get(`http://13.53.212.171:8081/api/audio/getStudent/${userId}`);
            return response.data;
        } catch (error) {
            setError("Failed to get hostel name.");
            console.error(error);
            return "";
        }
    };

    const formatTimestamp = (timestampString) => {
        try {
            const date = new Date(timestampString);
            return date.toLocaleString(); // You can customize the format here
        } catch (error) {
            console.error("Error formatting timestamp:", error);
            return "Invalid Date";
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Student Dashboard ID: {userId}</h2>
            {error && <p className="error">{error}</p>}
            {hostelName && <p>Hostel: {hostelName}</p>}
            {audios.length > 0 ? (
                <ul>
                    {audios.map(audio => (
                        <li key={audio.id} className="message-item">
                            <p>Sent by : {audio.facultyId}</p>
                            <p>Time: {formatTimestamp(audio.timestamp)}</p> {/* Display the timestamp */}
                            {audio.audioUrl ? (
                                <audio
                                    src={audio.audioUrl}
                                    controls
                                    onError={(e) => console.error("Audio Error:", e, "Audio:", audio)}
                                >
                                    <source src={audio.audioUrl} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            ) : (
                                <p>Audio unavailable.</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No audio messages for your hostel.</p>
            )}
            <button onClick={onLogout} className="logout-button">Logout</button>
        </div>
    );
}

export default StudentDashboard;