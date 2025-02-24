type Props = {
    expires_at: string;
    is_permanent: boolean;
    reason: string;
}

export default function Ban({ reason, expires_at, is_permanent }: Props) {
    return (
        <div className="my-6 flex items-center justify-center">
            <div className="space-y-2">
                <h2 className="text-center font-semibold">
                    You have been {is_permanent ? "permanently" : "temporarily"} banned from this community by a moderator.
                </h2>
                <p className="text-sm text-center">
                    Reason: {reason}
                </p>
                {
                    expires_at && (
                        <p className="text-center text-xs">
                            Ban expires on {new Date(expires_at).toLocaleDateString()}
                        </p>
                    )
                }
            </div>
        </div>
    )
}