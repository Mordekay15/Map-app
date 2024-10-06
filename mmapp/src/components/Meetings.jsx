import React, { useEffect, useState } from 'react';
import { supabase } from './SupabaseClient.jsx';
import './Meeting.css';

const Meeting = () => {
    const [meetings, setMeetings] = useState([]);

    const fetchMeetings = async () => {
        let { data, error } = await supabase
            .from('Meetings')
            .select('meetingName, venueName, meetingDate')
            .not('meetingName', 'is', null)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Ошибка при получении встреч:', error);
        } else {
            setMeetings(data);
            console.log(data);
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    return (
        <div className="meeting-container">
            <h1>Matching meetings</h1>
            <ul className="meeting-list">
                {meetings.map((meeting, index) => (
                    <li key={index} className="meeting-item">
                        <div className="meeting-details">
                            <div className="meeting-name">{meeting.meetingName}</div>
                            <div className="venue-name">{meeting.venueName}</div>
                        </div>
                        <div className="meeting-date">{meeting.meetingDate}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Meeting;
