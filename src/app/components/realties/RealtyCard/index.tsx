interface Props {
    data: any;
}

const RealtyCard: React.FC<Props> = ({
    data
}) => {
    return ( 
        <div
            className="
                border-[1px]
                rounded
            "
        >
            <div>
                <img src={data.mainPhoto} />
                <div className="p-5 flex flex-col gap-1">
                    <p className="font-semibold">{data.title}</p>
                    <p className="font-light text-neutral">{data.description}</p>
                    <p className="font-size text-lg font-bold">${data.price}</p>
                </div>
            </div>
        </div>
     );
}
 
export default RealtyCard;