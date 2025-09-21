import React from 'react';
import './globals.css';
import Navbar from '@/components/navbar';

export default function RootLayout(
    {children}: { children: React.ReactNode }
) {
    return (
        <html lang="en">
        <head>
            <title>My CRUD APP</title>
            <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous"/>
            <link rel="stylesheet" href="https://use.typekit.net/kxi4uok.css"/>
        </head>
        <body>
        <Navbar/>
        {children}
        </body>
        </html>
    );
}
