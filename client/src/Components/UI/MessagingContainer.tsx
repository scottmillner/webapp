import React from 'react';
import { faExclamationCircle, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './MessagingContainer.css';

export const messageType = {
    ServerError: 1,
    InvalidRequest: 2
};

interface MessagingContainerProps {
    messageType: number;
};

export const MessagingContainer: React.FC<MessagingContainerProps> = ({ messageType }) => {
    let id = '';
    let icon: IconDefinition;
    let iconStyle = { fontSize: '120px', marginBottom: '20px'};
    let message = '';
    switch(messageType) {
        case 1:
            id = 'serverErrorContainer'
            icon = faExclamationCircle;
            message = 'The server is currently down.';
            break;
        case 2:
            id = 'invalidRequestContainer'
            icon = faExclamationCircle;
            message = 'The page does not exist. Please check the URL is correct.';
            break;
    }

    const displayContainer = 
    <>
        <div id={id}>
            <FontAwesomeIcon icon={icon} style={iconStyle}/>
            <span>{message}</span>
        </div>
    </>;    

    return (
        <div className='messaging-container'>
            {displayContainer}
        </div>
    );
};