import { UserCircle, Bell, Settings } from 'lucide-react';

const Navbar = () => {
    return (
        <header className="h-16 border-b bg-background px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Federal Agentic Command
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-accent rounded-full text-muted-foreground">
                    <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-accent rounded-full text-muted-foreground">
                    <Settings className="w-5 h-5" />
                </button>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <UserCircle className="w-6 h-6" />
                </div>
            </div>
        </header>
    );
};

export default Navbar;