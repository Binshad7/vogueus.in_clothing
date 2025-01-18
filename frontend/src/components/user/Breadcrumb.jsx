import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
    const { pathname } = useLocation();
    const pathnames = pathname.split('/').filter((x) => x); // Split and filter the current path
    console.log(pathnames); // Debugging purposes

    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                    <Link
                        to="/"
                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black"
                    >
                        Home
                    </Link>
                    {pathnames.length > 0 && (
                        <svg
                            className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 9 4-4-4-4"
                            />
                        </svg>
                    )}
                </li>
                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`; // Generate the path dynamically
                    const isLast = index === pathnames.length - 1; // Check if it's the last breadcrumb
                    return (
                        <li key={to} className="inline-flex items-center">
                            {isLast ? (
                                <span className="text-sm font-medium text-gray-500">
                                    {value.charAt(0).toUpperCase() + value.slice(1)}
                                </span>
                            ) : (
                                <Link
                                    to={to}
                                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black"
                                >
                                    {value.charAt(0).toUpperCase() + value.slice(1)}
                                </Link>
                            )}
                            {!isLast && (
                                <svg
                                    className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 9 4-4-4-4"
                                    />
                                </svg>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
