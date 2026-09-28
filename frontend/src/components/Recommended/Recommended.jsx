import React, { useEffect, useState } from 'react'
import './Recommended.css'
import { API_KEY, value_convertor, format_duration } from '../../data'
import { Link } from 'react-router-dom'

const Recommended = ({categoryId}) => {

    const [apiData, setApiData] = useState([]);

    const fetchData = async () => {
        const relatedVideo_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=45&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;
        const res = await fetch(relatedVideo_url);
        const data = await res.json();
        let items = data.items || [];

        if (items.length > 0) {
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

        setApiData(items);
    }

    useEffect(() => {
        fetchData();
    }, [categoryId])

    return (
        <div className='recommended'>
            {apiData.map((item, index)=>{
                return (
                    <Link to={`/video/${item.snippet.categoryId}/${item.id}`} key={index} className="side-video-list">
                        <div className="thumbnail-container side-thumbnail">
                            <img src={item.snippet.thumbnails.medium.url} alt="" />
                            <span className="video-duration">{format_duration(item.contentDetails.duration)}</span>
                        </div>
                        <div className="side-video-info">
                            {item.channelLogo && <img className="channel-dp side-channel-dp" src={item.channelLogo} alt="" />}
                            <div className="vid-info">
                                <h4>{item.snippet.title}</h4>
                                <p>{item.snippet.channelTitle}</p>
                                <p>{value_convertor(item.statistics.viewCount)} Views</p>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}

export default Recommended