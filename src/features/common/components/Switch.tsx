type Props = {
    checked: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function Switch({ checked, onChange }: Props) {
    return (
    <label className="flex items-center cursor-pointer">
        <div className="relative">
            <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
            <div className={`block w-14 h-8 rounded-full ${checked ? "bg-primary" : "bg-secondary"} trasnition`}></div>
            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${checked ? "translate-x-full" : ""}`}></div>
        </div>
    </label>
    )
}