import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home, Circle, ExternalLink } from 'lucide-react';

const ModernBreadcrumb = () => {
    const { pathname } = useLocation();
    const pathnames = pathname.split('/').filter((x) => x);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const BreadcrumbItem = ({ children, isLast, to, index }) => {
        const isHovered = hoveredIndex === index;
        
        return (
            <li 
                className="relative flex items-center group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
            >
                {!isLast ? (
                    <Link
                        to={to}
                        className={`
                            flex items-center px-4 py-2 rounded-lg
                            relative overflow-hidden
                            ${isHovered ? 'text-white' : 'text-slate-600'}
                            transition-all duration-300 ease-in-out
                            hover:shadow-lg
                        `}
                    >
                        <div className={`
                            absolute inset-0 
                            bg-gradient-to-r from-blue-500 to-purple-600
                            opacity-0 group-hover:opacity-100
                            transition-opacity duration-300
                            rounded-lg
                        `} />
                        <div className="relative flex items-center gap-2">
                            {children}
                            {isHovered && (
                                <ExternalLink 
                                    size={14} 
                                    className="animate-fadeIn"
                                />
                            )}
                        </div>
                    </Link>
                ) : (
                    <span className="
                        flex items-center px-4 py-2
                        bg-gradient-to-r from-slate-100 to-slate-200
                        text-slate-800 font-medium
                        rounded-lg shadow-sm
                    ">
                        {children}
                    </span>
                )}
                
                {!isLast && (
                    <div className="flex items-center mx-1">
                        <Circle size={4} className="text-slate-300" />
                        <ChevronRight size={16} className="text-slate-400 mx-1" />
                        <Circle size={4} className="text-slate-300" />
                    </div>
                )}
            </li>
        );
    };

    return (
        <nav className="p-4 bg-white rounded-xl shadow-lg border border-slate-100">
            <ol className="flex flex-wrap items-center gap-1">
                <BreadcrumbItem to="/" isLast={pathnames.length === 0} index={-1}>
                    <Home 
                        size={18} 
                        className={`
                            transition-transform duration-300
                            group-hover:rotate-12
                        `}
                    />
                    <span>Home</span>
                </BreadcrumbItem>

                {pathnames.map((name, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    
                    return (
                        <BreadcrumbItem 
                            key={to} 
                            to={to} 
                            isLast={isLast}
                            index={index}
                        >
                            {name.split('-')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')}
                        </BreadcrumbItem>
                    );
                })}
            </ol>
        </nav>
    );
};

// Add required keyframes for animations
const styles = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
}

.animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default ModernBreadcrumb;