import { usePeerOnline, usePresencePhase } from '@/modules/chat/store/presenceStore';

export function PeerBadge({ userId }: { userId: number }) {
    const phase = usePresencePhase();
    const online = usePeerOnline(userId);

    if (phase === 'unknown' || online === undefined) {
        return <span>…checking</span>; // do not default to false
    }
    return (
        <span style={{ color: online ? 'green' : 'gray' }}>
      {online ? 'online' : 'offline'}
    </span>
    );
}


