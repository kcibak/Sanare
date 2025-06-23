"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DevStorage } from '@/lib/dev-storage';

interface Therapist {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
}

interface TherapistContextType {
    therapist: Therapist | null;
    isLoading: boolean;
    error: string | null;
    setTherapist: (credentials: { id: string; password: string }) => Promise<boolean>;
    logout: () => void;
}

const TherapistContext = createContext<TherapistContextType | undefined>(undefined);

export function TherapistProvider({ children }: { children: ReactNode }) {
    const [therapist, setTherapistState] = useState<Therapist | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check for existing login on initial load
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Initialize storage with demo data
            DevStorage.initializeStorage();
            
            // Check for existing login session
            const savedTherapistId = localStorage.getItem("currentTherapistId");
            if (savedTherapistId) {
                const therapistData = DevStorage.getTherapist(savedTherapistId);
                if (therapistData) {
                    setTherapistState({
                        id: therapistData.therapist_id,
                        firstName: therapistData.first_name,
                        lastName: therapistData.last_name,
                        email: therapistData.email
                    });
                }
            }
            
            setIsLoading(false);
        }
    }, []);

    const setTherapist = async (credentials: { 
        id: string; 
        password: string;
    }): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('Attempting login with credentials:', credentials);

            // Check for dummy therapist first (ID: 101)
            if (credentials.id === '101' && credentials.password === 'therapy123') {
                console.log('Logging in as dummy therapist');
                setTherapistState({
                    id: '101',
                    firstName: 'Default',
                    lastName: 'Therapist'
                });
                // Save current therapist ID for session persistence
                localStorage.setItem("currentTherapistId", credentials.id);
                return true;
            }

            // For all other therapists, check localStorage
            const storedTherapists = JSON.parse(localStorage.getItem('therapists') || '{}');
            console.log('Checking stored therapists:', storedTherapists);
            
            const storedTherapist = storedTherapists[credentials.id]?.[0];
            console.log('Found therapist:', storedTherapist);

            if (storedTherapist && storedTherapist.password === credentials.password) {
                setTherapistState({
                    id: storedTherapist.therapist_id,
                    firstName: storedTherapist.first_name,
                    lastName: storedTherapist.last_name,
                    email: storedTherapist.email
                });
                // Save current therapist ID for session persistence
                localStorage.setItem("currentTherapistId", credentials.id);
                return true;
            }

            return false;
        } catch (err) {
            console.error('Error in setTherapist:', err);
            setError('Failed to authenticate');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setTherapistState(null);
        localStorage.removeItem("currentTherapistId");
    };

    return (
        <TherapistContext.Provider value={{ therapist, isLoading, error, setTherapist, logout }}>
            {/* Development mode - TODO: fix for Vite */}
            {true && therapist && (
                <div className="fixed top-0 left-0 right-0 bg-yellow-100 text-yellow-800 p-2 text-center text-sm">
                    🚧 DEVELOPMENT MODE: Using account ({therapist.firstName} {therapist.lastName})
                </div>
            )}
            {children}
        </TherapistContext.Provider>
    );
}

export function useTherapist() {
    const context = useContext(TherapistContext);
    if (context === undefined) {
        throw new Error('useTherapist must be used within a TherapistProvider');
    }
    return context;
}