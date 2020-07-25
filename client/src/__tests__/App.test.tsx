import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { App } from '../App';
import { useHttpResult } from '../Components/Hooks/useHttp';

jest.mock('../Components/Hooks/useHttp.ts');
const mockUseHttpModule = require('../Components/Hooks/useHttp');

describe('<App/>', () => {
  it('renders', () => {
    // Arrange 
    const defaultImplementation = getUseHttpModuleMockImplementations().defaultImplementation;
    const fetchCompleteProfileImageImplementation = getUseHttpModuleMockImplementations().fetchCompleteProfileImageImplementation;
    const fetchCompleteDenverImageImplementation = getUseHttpModuleMockImplementations().fetchCompleteDenverImageImplementation;
    mockUseHttpModule.useHttp
        .mockImplementationOnce(() => fetchCompleteProfileImageImplementation)
        .mockImplementationOnce(() => fetchCompleteDenverImageImplementation)
        .mockImplementationOnce(() => defaultImplementation);

    // Act
    render(<App />);
    const app = document.getElementById('app') as HTMLDivElement;

    // Assert
    expect(app).toBeInTheDocument();
  });

  it('displays <Spinner /> while fetching data', () => {
    // Arrange
    const fetchingDataImplementation = getUseHttpModuleMockImplementations().fetchingDataImplementation;
    mockUseHttpModule.useHttp.mockImplementation(() => fetchingDataImplementation);

    // Act
    render(<App />);
    const spinner = document.querySelector('.spinner-wrapper') as HTMLDivElement;

    // Assert
    expect(spinner).toBeInTheDocument();

  });

  it('displays <MessagingContainer /> with \'The server is currently down.\' message', () => {
    // Arrange
    const failedToFetchErrorImplementation = getUseHttpModuleMockImplementations().failedToFetchErrorImplementation;
    mockUseHttpModule.useHttp.mockImplementation(() => failedToFetchErrorImplementation)
    
    // Act
    render(<App />);
    const messagingContainer = document.getElementById('serverErrorContainer') as HTMLDivElement;

    // Assert
    expect(messagingContainer).toBeInTheDocument();
    expect(screen.getByText('The server is currently down.')).toBeInTheDocument();
  });
});

const getUseHttpModuleMockImplementations = () => {
    const defaultImplementation: useHttpResult = {
        isLoading: false,
        data: null,
        error: null,
        identifier: 'default',
        sendRequest: jest.fn()
    };

    const fetchingDataImplementation: useHttpResult = {
        isLoading: true,
        data: null,
        error: null,
        identifier: '',
        sendRequest: jest.fn()
    };

    const fetchCompleteProfileImageImplementation: useHttpResult = {
        isLoading: false,
        data: new Blob(),
        error: null,
        identifier: 'profileImage',
        sendRequest: jest.fn()
    };

    const fetchCompleteDenverImageImplementation: useHttpResult = {
        isLoading: false,
        data: new Blob(),
        error: null,
        identifier: 'denverImage',
        sendRequest: jest.fn()
    };

    const failedToFetchError = new Error();
    failedToFetchError.message = 'Failed to fetch';
    const failedToFetchErrorImplementation: useHttpResult = {
        isLoading: false,
        data: null,
        error: failedToFetchError,
        identifier: '',
        sendRequest: jest.fn()
    };

    return {
        defaultImplementation,
        fetchingDataImplementation,
        fetchCompleteProfileImageImplementation,
        fetchCompleteDenverImageImplementation,
        failedToFetchErrorImplementation
    };
};
