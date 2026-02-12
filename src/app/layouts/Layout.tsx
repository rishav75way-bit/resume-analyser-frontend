import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { FileSearch, History, LogOut, User, Menu, X, BarChart3, FileText } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { ROUTES, LABELS, NAV_LINKS } from '../utils/constants';
import { Button } from '../components/Button';

const NAV_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
    [ROUTES.DASHBOARD]: FileSearch,
    [ROUTES.HISTORY]: History,
    [ROUTES.ANALYTICS]: BarChart3,
    [ROUTES.COVER_LETTER]: FileText,
};

export const Layout: React.FC = () => {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate(ROUTES.LOGIN);
        setMobileMenuOpen(false);
    };

    const isActiveRoute = (path: string) => location.pathname === path;

    const handleNavClick = () => {
        setMobileMenuOpen(false);
    };

    const renderAuthenticatedNav = () => (
        <>
            <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-slate-800/60 to-slate-800/40 border border-slate-700/60 shadow-md">
                <div className="p-1 rounded-lg bg-primary-500/10 border border-primary-500/20">
                    <User size={14} className="text-primary-400" />
                </div>
                <span className="text-sm font-medium text-slate-200">{user?.email}</span>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="text-sm gap-2 hover:bg-slate-800/50">
                <LogOut size={16} />
                <span className="hidden sm:inline">{LABELS.LOGOUT}</span>
            </Button>
        </>
    );

    const renderUnauthenticatedNav = () => (
        <>
            <Link to={ROUTES.LOGIN}>
                <Button variant="ghost" className="text-sm hover:bg-slate-800/50">{LABELS.LOGIN}</Button>
            </Link>
            <Link to={ROUTES.REGISTER}>
                <Button className="text-sm">{LABELS.SIGN_UP}</Button>
            </Link>
        </>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
            <nav className="border-b border-slate-800/60 bg-slate-900/95 backdrop-blur-2xl sticky top-0 z-50 shadow-2xl shadow-black/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-4 sm:gap-8">
                            <Link to={ROUTES.HOME} className="flex items-center gap-2.5 text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent hover:from-primary-300 hover:via-primary-400 hover:to-primary-500 transition-all duration-300 drop-shadow-lg">
                                <div className="p-1.5 rounded-lg bg-primary-500/10 border border-primary-500/20">
                                    <FileSearch className="text-primary-400" size={22} />
                                </div>
                                <span className="hidden sm:inline tracking-tight">{LABELS.APP_NAME}</span>
                            </Link>
                            {isAuthenticated && (
                                <>
                                    <div className="hidden md:flex items-center gap-1">
                                        {NAV_LINKS.map((link) => {
                                            const Icon = NAV_ICONS[link.to];
                                            const isActive = isActiveRoute(link.to);
                                            return (
                                                <Link
                                                    key={link.to}
                                                    to={link.to}
                                                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                                        isActive
                                                            ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-300 border border-primary-500/40 shadow-lg shadow-primary-500/10'
                                                            : 'text-slate-400 hover:text-primary-300 hover:bg-slate-800/60 border border-transparent hover:border-slate-700/50'
                                                    }`}
                                                >
                                                    {Icon && <Icon size={18} />}
                                                    <span className="font-medium">{link.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                    <button
                                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                        className="md:hidden p-2 rounded-lg text-slate-400 hover:text-primary-400 hover:bg-slate-800/50 transition-colors"
                                        aria-label="Toggle menu"
                                    >
                                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {isAuthenticated ? renderAuthenticatedNav() : renderUnauthenticatedNav()}
                        </div>
                    </div>
                </div>
                {isAuthenticated && mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-800/50 bg-slate-900/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 space-y-1">
                            {NAV_LINKS.map((link) => {
                                const Icon = NAV_ICONS[link.to];
                                const isActive = isActiveRoute(link.to);
                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        onClick={handleNavClick}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                                        isActive
                                                            ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-300 border border-primary-500/40 shadow-md shadow-primary-500/10'
                                                            : 'text-slate-400 hover:text-primary-300 hover:bg-slate-800/60 border border-transparent hover:border-slate-700/50'
                                                    }`}
                                    >
                                        {Icon && <Icon size={20} />}
                                        <span className="font-medium">{link.label}</span>
                                    </Link>
                                );
                            })}
                            <div className="pt-2 mt-2 border-t border-slate-800/50">
                                <div className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400">
                                    <User size={16} />
                                    <span className="truncate">{user?.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Outlet />
            </main>
        </div>
    );
};
