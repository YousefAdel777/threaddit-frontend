export default function Loading({ text }: { text?: string }) {
    return (
        <div className="flex flex-col justify-center gap-4">
            <span className="w-16 h-16 mx-auto rounded-full border-4 border-transparent border-t-primary animate-spin" />
            <p className="text-sm mx-auto">
                {text}
            </p>
        </div>
    );
}