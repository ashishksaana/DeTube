import React, { useState, useEffect } from 'react'
import './Feed.css'
import thumbnail1 from '../../../assets/thumbnail1.png'
import thumbnail2 from '../../../assets/thumbnail2.png'
import thumbnail3 from '../../../assets/thumbnail3.png'
import thumbnail4 from '../../../assets/thumbnail4.png'
import thumbnail5 from '../../../assets/thumbnail5.png'
import thumbnail6 from '../../../assets/thumbnail6.png'
import thumbnail7 from '../../../assets/thumbnail7.png'
import thumbnail8 from '../../../assets/thumbnail8.png'
import { Link } from 'react-router-dom'
import { API_KEY, value_convertor, format_duration } from '../../../data'
import moment from 'moment'

function Feed({ category }) {

    const [data, setData] = useState([]);

    const fetchData = async () => {
        const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`
        const res = await fetch(videoList_url);
        const videoData = await res.json();
        let items = videoData.items || [];

        if (items.length > 0) {
            // Fetch channel details to get the channel logos
            const channelIds = [...new Set(items.map(item => item.snippet.channelId))].join(',');
            const channel_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds}&key=${API_KEY}`;
            const channelRes = await fetch(channel_url);
            const channelData = await channelRes.json();
            
            const channelLogos = {};
            if (channelData.items) {
                channelData.items.forEach(channel => {
                    channelLogos[channel.id] = channel.snippet.thumbnails.default.url;
                });
            }

            items = items.map(item => ({
                ...item,
                channelLogo: channelLogos[item.snippet.channelId] || ''
            }));
        }

        // Fisher-Yates shuffle algorithm to randomize the videos on refresh
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }
        setData(items);
    }

    useEffect(() => {
        fetchData();
    }, [category])

    return (
        <div className='feed'>
            {data.map((item, index) => {
                return (
                    <Link to={`video/${item.snippet.categoryId}/${item.id}`} className='card' key={index}>
                        <div className="thumbnail-container">
                            <img className="video-thumbnail" src={item.snippet.thumbnails.medium.url} alt="thumbnail" />
                            <span className="video-duration">{format_duration(item.contentDetails.duration)}</span>
                        </div>
                        <div className="card-info">
                            {item.channelLogo && <img className="channel-dp" src={item.channelLogo} alt="" />}
                            <div className="card-text">
                                <h2>{item.snippet.title}</h2>
                                <h3>{item.snippet.channelTitle}</h3>
                                <p>{value_convertor(item.statistics.viewCount)} views • {moment(item.snippet.publishedAt).fromNow()}</p>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}

export default Feed