import React from 'react';
import {CSSProperties} from 'react';
import {PrecompiledCss} from 'react-spinners/interfaces';
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// create interface if I ever want to use a 3rd party library
interface SpinnerProps {
    height?: number;
    width?: number;
    size?: number;
    color?: string;
    classname?: string;
    type?: string;
    styles?: string | CSSProperties | PrecompiledCss;
}
export const Spinner: React.FC<SpinnerProps> = ({height, width, size, color, classname, type, styles}) => {
    return (
        <div className='spinner-wrapper'>
            <FontAwesomeIcon icon={faSync} spin className={classname} />
            <span>Loading ...</span>
        </div>
    );
};