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
            {/* so... Adobe for some reason does not have any good way of loading fonts quickly. See below for more info*/}
            {/* https://community.adobe.com/t5/adobe-fonts-discussions/web-vital-issue-causing-render-blocking-issue-while-using-typekit-cdn/m-p/14671180 */}
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
