"use client";

import React from "react";

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
    constructor(props: React.PropsWithChildren) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-brand-silver">
                    <div className="text-center px-6">
                        <h2 className="text-2xl font-semibold text-brand-navy mb-2">Algo salió mal</h2>
                        <p className="text-gray-500 mb-6">Hubo un error inesperado. Por favor recargá la página.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-brand-navy text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Recargar
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
