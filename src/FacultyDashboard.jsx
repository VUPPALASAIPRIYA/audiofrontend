// FacultyDashboard.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from "axios";

function FacultyDashboard({ userId, onLogout }) {
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [hostel, setHostel] = useState('all');
    const [sentMessages, setSentMessages] = useState([]);
    const [sendStatus, setSendStatus] = useState({});
    const hostels = ['all', 'Himalaya', 'Kanchanaganga', 'Tulips', 'Vindhya', 'Aravalli', 'Staff-Quarters'];
    const audioChunks = useRef([]);

    useEffect(() => {
        const storedMessages = JSON.parse(localStorage.getItem('sentMessages')) || [];
        setSentMessages(storedMessages);
    }, []);

    useEffect(() => {
        localStorage.setItem('sentMessages', JSON.stringify(sentMessages));
    }, [sentMessages]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                setAudioURL(url);
                audioChunks.current = [];
            };

            recorder.start();
            setMediaRecorder(recorder);
            setRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Error accessing microphone.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setRecording(false);
        }
    };

    const handleSendAudio = async () => {
        if (!audioURL) {
            alert('Please record audio first.');
            return;
        }

        setSendStatus((prev) => ({ ...prev, [audioURL]: 'sending' }));

        try {
            const response = await fetch(audioURL);
            const audioBlob = await response.blob();

            const formData = new FormData();
            formData.append('file', audioBlob, 'recorded-audio.webm');
            formData.append('hostel', hostel);
            formData.append('facultyId', userId);

            await axios.post('http://13.53.212.171:8081/api/audio/upload', formData);

            const now = new Date();
            const formattedDate = now.toLocaleString();
            setSentMessages((prevMessages) => [
                ...prevMessages,
                { hostel, time: formattedDate, audioURL: audioURL },
            ]);
            setAudioURL(null);
            setSendStatus((prev) => ({ ...prev, [audioURL]: 'sent' }));
        } catch (error) {
            console.error('Error sending audio:', error);
            alert('Error sending audio.');
            setSendStatus((prev) => ({ ...prev, [audioURL]: 'failed' }));
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Faculty ID: {userId}</h2>
            <div>
                {recording ? (
                    <button onClick={stopRecording}>Stop Recording</button>
                ) : (
                    <button onClick={startRecording}>Start Recording</button>
                )}
            </div>
            {audioURL && <audio src={audioURL} controls />}
            <select
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                className="hostel-select"
            >
                {hostels.map((h) => (
                    <option key={h} value={h}>
                        {h}
                    </option>
                ))}
            </select>
            <button onClick={handleSendAudio} disabled={!audioURL} className="send-button">
                Send Audio
            </button>
            <button onClick={onLogout} className="logout-button">
                Logout
            </button>

            <div>
                <h3>Sent Messages</h3>
                <ul>
                    {sentMessages.map((message, index) => (
                        <li key={index}>
                            Sent to: {message.hostel === 'all' ? 'All Hostels' : message.hostel} at {message.time}
                            {message.audioURL && (
                                <div>
                                    <audio src={message.audioURL} controls />
                                    {sendStatus[message.audioURL] && (
                                        <p>Status: {sendStatus[message.audioURL]}</p>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default FacultyDashboard;