'use client';

import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {http} from "../http";
import toast from "react-hot-toast";
import Container from "../components/Container";
import Heading from "../components/Heading";
import {Link, Stack, Typography} from "@mui/material";
import Image from "next/image"

const ConfirmEmail = () => {
	const getParams = useSearchParams();
	const router = useRouter();
	
	useEffect(() => {
		http.get(`/users/auth/confirm-email/${getParams.get('code')}`)
			.then(res => {
				const user = res.data;
				const fullName = [user?.firstName, user?.middleName, user?.lastName].join(' ');

				// router.push('/');

				toast.success(`Уважаемый ${fullName}! Ваш e-mail успешно подтвержден, приятного пользования!`);
			});
	});

	return ( <Container>
		
		<Stack spacing={1} alignItems={'center'} className="w-[40vw] rounded-xl border-solid border-[5px] border-indigo-400 p-5" style={{margin: '0 auto', marginTop: 50}}>
			<Image src="images/logo/logo.svg" width={150} height={150} alt={""} />
			<Heading
				title="Ура! Последний шаг пройден"
				subtitle="Ваш e-mail адрес успешно подверждён. Теперь Вы можете пользоваться услугами нашего сервиса. Также рекомендуем Вам использовать наш telegram-бот HomeGuru. С ним будет гораздно удобнее!"
				center
			/>
			<Stack spacing={2}>
				<Link href="/">Главная страница HomeGuru</Link>
				<Link href="https://t.me/homeguru_bot" target="_blank">Telegram-бот HomeGuru</Link>
			</Stack>
		</Stack>
	</Container> );
}
 
export default ConfirmEmail;