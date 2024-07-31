import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { API_URL } from '@env';
import { Candidate, ElectionContextProps } from '../types/app';

const ElectionContext = createContext<ElectionContextProps | undefined>(undefined);

export const useElection = (): ElectionContextProps => {
    const context = useContext(ElectionContext);
    if (!context) {
        throw new Error('useElection must be used within an ElectionProvider');
    }
    return context;
};

interface ElectionProviderProps {
    children: ReactNode;
}

export const ElectionProvider: React.FC<ElectionProviderProps> = ({ children }) => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);

    // useEffect(() => {
    //     const fetchCandidates = async () => {
    //         try {
    //             const response = await fetch(`${API_URL}/candidates`);
    //             const data = await response.json();
    //             setCandidates(data.candidates);
    //         } catch (error) {
    //             console.error('Error fetching candidates:', error);
    //         }
    //     };

    //     fetchCandidates();
    // }, [candidates]);

    const updateCandidates = async () => {
        try {
            // const response = await fetch(`${API_URL}/candidates`);
            // const data = await response.json();
            // setCandidates(data.candidates);
        } catch (error) {
            console.error('Error fetching candidates:', error);
        }
    };

    return (
        <ElectionContext.Provider value={{ candidates, updateCandidates }}>
            {children}
        </ElectionContext.Provider>
    );
};
