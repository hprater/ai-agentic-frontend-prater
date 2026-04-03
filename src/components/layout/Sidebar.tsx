import { NavLink } from 'react-router-dom';
import { ShieldCheck, Cpu, Cloud, Terminal } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { name: 'CISO Command', path: '/dashboard', icon: ShieldCheck },
        { name: 'Amplify Specialist', path: '/specialist/amplify', icon: Cpu },
        { name: 'AWS Specialist', path: '/specialist/aws', icon: Cloud },
        { name: 'Google Specialist', path: '/specialist/google', icon: Cloud },
    ];

    return (
        <nav className="w-64 border-r bg-card p-4 space-y-2">
            <div className="mb-8 px-2 flex items-center gap-2">
                <Terminal className="w-6 h-6 text-primary" />
                <span className="font-bold text-lg">Amplify Fed</span>
            </div>
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                            isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                        }`
                    }
                >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                </NavLink>
            ))}
        </nav>
    );
};

export default Sidebar;