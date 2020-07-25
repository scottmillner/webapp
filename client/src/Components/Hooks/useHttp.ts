import {useReducer, useCallback} from 'react';

interface HttpState {
    loading: boolean;
    data: Blob;
    error: Error;
    identifier?: string;
};

interface HttpAction {
    type: string;
    data?: Blob;
    error?: Error;
    identifier?: string;
};

const initialState: HttpState = {
    loading: true,
    data: null,
    error: null,
    identifier: null
};

const httpReducer = (currentHttpState: HttpState, action: HttpAction) => {
    switch (action.type) {
        case 'SEND': return {
            loading: true,
            error: null,
            data: null,
        };
        case 'RESPONSE': return {
            ...currentHttpState,
            loading: false,
            data: action.data,
            identifier: action.identifier
        };
        case 'ERROR': return {
            ...currentHttpState,
            loading: false,
            error: action.error
        };
        default: return currentHttpState;
    }
};

export interface useHttpResult {
    isLoading: boolean;
    data: Blob;
    error: Error;
    identifier: string;
    sendRequest: (url: string, method: string, abortController: AbortController, body?: BodyInit, identifier?: string) => void  
}

export function useHttp(): useHttpResult {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

    const sendRequest = useCallback((url: string, method: string, abortController: AbortController, body?: BodyInit, identifier?: string) => {
        dispatchHttp({type: 'SEND'});

        fetch(url, {
            method: method,
            body: body,
            mode: "cors",
            signal: abortController.signal
        })
        .then(response => {
            return response.blob();
        })
        .then(data => {
            dispatchHttp({type: 'RESPONSE', data: data, identifier: identifier})
        })
        .catch(error => {
            // don't need to dispatch error when fetch aborted
            if (!abortController.signal.aborted) {
                dispatchHttp({type: 'ERROR', error: error})
            }
        });
    }, []);

    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        identifier: httpState.identifier,
        sendRequest: sendRequest
    };
};