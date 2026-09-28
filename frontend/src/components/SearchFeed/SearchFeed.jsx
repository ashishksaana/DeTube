import React, { useState, useEffect } from 'react'
import './SearchFeed.css'
import { Link, useParams } from 'react-router-dom'
import { API_KEY, value_convertor, format_duration } from '../../data'
import moment from 'moment'

function SearchFeed() {
    const { searchQuery } = useParams();
    const [data, setData] = useState([]);

    const fetchSearchData = async () => {
        // 1. Get search results (videos, playlists, channels)
        const search_url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${searchQuery}&key=${API_KEY}`;
        const res = await fetch(search_url);
        const searchData = await res.json();

        if (!searchData.items || searchData.items.length === 0) {
            setData([]);
            return;
        }

        const videoIds = searchData.items
            .filter(item => item.id.kind === 'youtube#video')
            .map(item => item.id.videoId)
            .join(',');

        // 2. Fetch full details (including statistics) for videos only
        let detailsData = { items: [] };
        if (videoIds) {
            const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoIds}&key=${API_KEY}`;
            const detailsRes = await fetch(videoDetails_url);
            detailsData = await detailsRes.json();
        }

        // 3. Fetch channel details to get the channel logos
        const channelIds = [...new Set(searchData.items.map(item => item.snippet.channelId))].filter(Boolean).join(',');
        const channelLogos = {};
        if (channelIds) {
            const channel_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds}&key=${API_KEY}`;
            const channelRes = await fetch(channel_url);
            const channelData = await channelRes.json();
            if (channelData.items) {
                channelData.items.forEach(channel => {
                    channelLogos[channel.id] = channel.snippet.thumbnails.default.url;
                });
            }
        }

        // Merge the logo URL and video details into the final data
        const finalData = searchData.items.map(searchItem => {
            const isVideo = searchItem.id.kind === 'youtube#video';
            const isPlaylist = searchItem.id.kind === 'youtube#playlist';
            const isChannel = searchItem.id.kind === 'youtube#channel';

            let id = '';
            if (isVideo) id = searchItem.id.videoId;
            if (isPlaylist) id = searchItem.id.playlistId;
            if (isChannel) id = searchItem.id.channelId;

            let extraData = {};
            if (isVideo) {
                const videoDetail = detailsData.items.find(v => v.id === id);
                if (videoDetail) {
                    extraData = {
                        contentDetails: videoDetail.contentDetails,
                        statistics: videoDetail.statistics,
                        categoryId: videoDetail.snippet.categoryId
                    };
                }
            }

            return {
                ...searchItem,
                id,
                kind: searchItem.id.kind,
                ...extraData,
                channelLogo: channelLogos[searchItem.snippet.channelId] || ''
            };
        });

        setData(finalData);
    }

    useEffect(() => {
        fetchSearchData();
    }, [searchQuery])

    return (
        <div className="search-feed">
            {data.map((item, index) => {
                const isVideo = item.kind === 'youtube#video';
                return (
                    <Link to={isVideo ? `/video/${item.categoryId || '0'}/${item.id}` : '#'} className="search-card" key={index}>
                        <div className="thumbnail-container search-thumbnail-wrapper">
                            <img src={item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url} alt="" className="search-thumbnail" />
                            {isVideo && item.contentDetails?.duration ? (
                                <span className="video-duration">{format_duration(item.contentDetails.duration)}</span>
                            ) : item.kind === 'youtube#playlist' ? (
                                <span className="video-duration">Playlist</span>
                            ) : null}
                        </div>
                        <div className="search-info">
                            <div className="search-text">
                                <h2>{item.snippet.title}</h2>
                                <p className="search-meta">
                                    {isVideo && item.statistics?.viewCount ? `${value_convertor(item.statistics.viewCount)} Views • ` : ''}
                                    {moment(item.snippet.publishedAt).fromNow()}
                                </p>
                                <div className="search-channel-container">
                                    {item.channelLogo && <img className="channel-dp search-channel-dp" src={item.channelLogo} alt="" />}
                                    <p className="search-channel-name">{item.snippet.channelTitle}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}

export default SearchFeed
