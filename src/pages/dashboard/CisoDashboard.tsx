import ChatInterface from '@/components/chat/ChatInterface';

const CisoDashboard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full p-6">
            <div className="md:col-span-3 flex flex-col space-y-4">
                <section>
                    <h1 className="text-3xl font-extrabold">CISO Orchestrator</h1>
                    <p className="text-muted-foreground">Unified Command for Agentic Operations</p>
                </section>

                <div className="flex-1 min-h-[500px] border shadow-sm rounded-xl overflow-hidden">
                    <ChatInterface targetAgent="ciso" />
                </div>
            </div>

            <aside className="space-y-6">
                <div className="p-4 border rounded-lg bg-card text-card-foreground">
                    <h3 className="font-semibold mb-2">Fleet Status</h3>
                    <ul className="text-sm space-y-2">
                        <li className="flex justify-between"><span>Amplify Specialist</span> <span className="text-green-500">● Online</span></li>
                        <li className="flex justify-between"><span>AWS Specialist</span> <span className="text-green-500">● Online</span></li>
                        <li className="flex justify-between"><span>Systems Engineer</span> <span className="text-yellow-500">● Idle</span></li>
                    </ul>
                </div>
            </aside>
        </div>
    );
};

export default CisoDashboard;