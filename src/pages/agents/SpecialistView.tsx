import { useParams } from 'react-router-dom';
import ChatInterface from '@/components/chat/ChatInterface';

const SpecialistView = () => {
    const { agentId } = useParams<{ agentId: string }>();

    // Map the URL ID to a friendly display name
    const agentNames: Record<string, string> = {
        'amplify': 'Amplify Deploy Specialist',
        'aws': 'AWS Cloud Specialist',
        'google': 'Google Cloud Specialist',
    };

    const displayName = agentNames[agentId || ''] || 'Unknown Specialist';

    return (
        <div className="flex flex-col h-full p-4">
            <header className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">{displayName}</h1>
                <p className="text-muted-foreground">
                    Direct secure link to the {agentId} specialist agent.
                </p>
            </header>

            <div className="flex-1 border rounded-lg bg-background overflow-hidden">
                {/* Pass the agentId so the chat knows which backend to hit */}
                <ChatInterface targetAgent={agentId || 'unknown'} />
            </div>
        </div>
    );
};

export default SpecialistView;