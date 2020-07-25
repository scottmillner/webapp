import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { useHttp } from './Components/Hooks/useHttp';
import { MessagingContainer, messageType } from './Components/UI/MessagingContainer';
import { Spinner } from './Components/UI/Spinner';
import './App.css';

export const App: React.FC = props => {
    const [isLoadingProfileImage, setIsLoadingProfileImage] = useState(true);
    const [isLoadingDenverImage, setIsLoadingDenverImage] = useState(true);
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [denverImageUrl, setDenverImageUrl] = useState('');
    const {data, error, sendRequest, identifier} = useHttp();

    // fetch images
    useEffect(() => {
        const profileImageAbortController = new AbortController();
        const denverImageAbortController = new AbortController();

        // sendRequest('https://localhost:44378/api/S3?image=ProfileImage', 'GET', profileImageAbortController, null, 'profileImage');
        // sendRequest('https://localhost:44378/api/S3?image=DenverImage', 'GET', denverImageAbortController, null, 'denverImage');

        sendRequest('/api/S3?image=ProfileImage', 'GET', profileImageAbortController, null, 'profileImage');
        sendRequest('/api/S3?image=DenverImage', 'GET', denverImageAbortController, null, 'denverImage');

        // cleanup
        return () => {
            profileImageAbortController.abort();
            denverImageAbortController.abort();
        };
    }, [sendRequest]);

    // handle images
    useEffect(() => {
        if (!error && data && identifier === 'profileImage') {
            setProfileImageUrl(URL.createObjectURL(data));

            setIsLoadingProfileImage(false);
        }

        if (!error && data && identifier === 'denverImage') {
            setDenverImageUrl(URL.createObjectURL(data));

            setIsLoadingDenverImage(false);
        }

        if (error) {
            setIsLoadingProfileImage(false);
            setIsLoadingProfileImage(false);
            // error message when webapi is down
            if (error.message === 'Failed to fetch') {
                const headerEl = document.querySelector('.app__header') as HTMLHeadElement;
                if (headerEl) headerEl.style.display = 'none';

                const messagingContainer = document.getElementById('messaging-container') as HTMLDivElement;
                if (messagingContainer) render(<MessagingContainer messageType={messageType.ServerError} />, messagingContainer);
            }
        }
    }, [error, data, identifier]);

    const appHeaderStyle: React.CSSProperties = {
        backgroundImage: `linear-gradient(to top, rgba(170, 168, 164, 0.6) 100%, transparent), url(${denverImageUrl})`
    };


    return ( 
        (isLoadingProfileImage || isLoadingDenverImage) && !error ? <Spinner classname="spinner"/> : 
        <div id='app' className='app'>
            <header className='app__header' style={appHeaderStyle}>
            <div className='header__profile-details'>Full-Stack Software Engineer proficient in C#/.NET, Java, Spring, JavaScript, TypeScript, React, SQL Server, PostgreSQL, Microservices, SOLID principles, and Agile development. </div>
            <div className='header__profile-image-container'>
                <img src={profileImageUrl} id='profile-pic' alt='profile' />
            </div>
            </header>
            <div id='messaging-container'></div>
        </div>
    );
};