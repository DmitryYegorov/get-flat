interface Props {
    onClick: () => void;
    label: string;

}

export default function MenuItem(props: Props) {
    const {
        onClick,
        label
    } = props;

    return (
        <div
            className="
                px-4
                py-3
                hover:bg-neutral-100
                transition
                font-semibold
            "
            onClick={onClick}
        >{label}</div>
    );
}