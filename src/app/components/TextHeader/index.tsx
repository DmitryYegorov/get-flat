import {Typography} from "@mui/material";

interface Props {
	text: string;
}

const TextHeader: React.FC<Props> = ({text}) => {
	return (
		<div className="mt-[20px] p-1">
			<Typography variant="h5" style={{
				borderBottom: '3px solid indigo',
				display: 'inline-block',
			}} className="first-letter:text-indigo-800 first-letter:font-semibold">{text}</Typography>
		</div>
	);
}
 
export default TextHeader;