'use client';

import {useEffect, useState} from "react";
import ClientOnly from "../components/ClientOnly";
import Container from "../components/Container";
import {approveRealtyRequest, approveReviewRequest, blockUserReq, getAllCreatedReviews, getCreatedRealties, getUsersList, rejectRealtyRequest, rejectReviewRequest, sendVerificationLetter, unblockUserReq} from "../http/admin";
import {Grid, ListItem, ListItemButton, List, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Link, Stack, Avatar, Typography, Collapse, Box, IconButton, TextField, Chip, Button, Menu, MenuItem} from "@mui/material";
import dayjs from "dayjs";
import { MdOutlineCancel, MdStarBorder} from "react-icons/md";
import {indigo} from "@mui/material/colors";
import {IoCheckmark} from "react-icons/io5";
import toast from "react-hot-toast";
import ConfirmationDialog from "../components/ConfirmatinoDialog";
import TextHeader from "../components/TextHeader";
import ImageSettings from "../my-realty/components/ImageSettings";
import {RealtyStatusMap, UserStatusMap} from "../maps";
import { GiHamburgerMenu } from "react-icons/gi";
import { isMobile } from 'react-device-detect';


enum Sections {
	REVIEWS = 0,
	REALTIES = 1,
	USERS = 2,
}

function containsHTML(inputString: string): boolean {
    // Регулярное выражение для поиска HTML-тегов
    const htmlRegex = /<[^>]*>/;
    return htmlRegex.test(inputString);
}


const AdminPanel = () => {

	const [reviews, setReviews] = useState([]);
	const [realties, setRealties] = useState([]);
	const [users, setUsers] = useState<any[]>([]);
	const [filteredRealties, setFilteredRealties] = useState([]);

	const [currentSection, setCurrentSection] = useState(Sections.REVIEWS);

	const [openReview, setOpenReview] = useState(null);
	const [openRealty, setOpenRealty] = useState(null);

	const [rejectReviewOpen, setRejectReviewOpen] = useState(null);
	const [rejectRealtyOpen, setRejectRealtyOpen] = useState(null);
	const [blockUserOpen, setBlockUserOpen] = useState(null);

	const [rejectNotes, setRejectNotes] = useState(null);

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	useEffect(() => {
		if (currentSection === Sections.REVIEWS || !reviews?.length) {

			getAllCreatedReviews()
				.then(res => {
					const data = res.data;
					setReviews(data);
				})
		}
		
		if (currentSection === Sections.REALTIES || !realties?.length) {
			getCreatedRealties()
				.then((res) => {
					console.log('ok')
					const list = res.data;

					setRealties(list);
					setFilteredRealties(list);
				});
		}

		if (currentSection === Sections.USERS && !users?.length) {
			getUsersList()
				.then(res => {
					const list = res.data;
					setUsers(list);
				})
		}
	}, [currentSection]);

	const approveReview = (reviewId: string) => {
		approveReviewRequest(reviewId)
			.then((res) => {
				const data = res.data;

				if (data?.id) {
					toast.success("Отзыв одобрен, теперь он появиться на доске отзывов!");
				}
				setRealties((v) => v.filter((r: any) => r.id != data?.id));
			})
	}

	const approveRealty = (realtyId: string) => {
		approveRealtyRequest(realtyId)
			.then((res) => {
				const data = res.data;

				if (data?.id) {
					toast.success("Публикация успешно одобрена!");
				}
				setRealties((v) => v.filter((r: any) => r.id != data?.id));
			})
	}

	const rejectReview = (reviewId: string, rejectNotes: string) => {
		rejectReviewRequest(reviewId, rejectNotes)
			.then((res) => {
				const data = res.data;

				if (data?.id) {
					toast.success("Пользователь был уведомлен об отклонении его отзыва!");
					setRejectReviewOpen(null);
				}
				setReviews((v) => v.filter((r: any) => r.id != data?.id));
			})
	}

	const rejectRealty = (realtyId: string, rejectNotes: string) => {
		rejectRealtyRequest(realtyId, rejectNotes)
			.then((res) => {
				const data = res.data;

				if (data?.id) {
					toast.success("Пользователь был уведомлен об отклонении его публикации!");
					setRejectRealtyOpen(null);
				}
				setReviews((v) => v.filter((r: any) => r.id != data?.id));
			})
	}

	const getReviewMarkup = (r: any) => (
		<Box margin={2}>
			<div className="font-light">
				от <u><i>{r?.user?.firstName} {r?.user?.middleName} {r?.user?.lastName}</i></u>
			</div>
			<br/>
			{r.text}
			<br/>
			<b>Не понравилось</b>
			<br/>
			{r.disadvantages}
			<br/>
			<b>Понравилось</b><br/>
			{r.advantages}
		</Box>
	)

	let bodyContent = null;

	if (currentSection === Sections.REVIEWS) {
		bodyContent = (
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Недвижимость</TableCell>
							<TableCell>Пребывание</TableCell>
							<TableCell>Оценка гостя</TableCell>
							<TableCell>
								Дата создания
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{reviews?.length === 0 && (<Typography variant="h6" style={{margin: 15}}>Пока нет отзывов...</Typography>)}
						{reviews?.map((r: any) => (
							<>
								<TableRow className="hover:bg-indigo-100 cursor-pointer transition-all" onClick={() => setOpenReview((v) => v === r.id ? null : r.id)}>
									<TableCell>
										<Stack direction={'row'} alignItems={'center'} spacing={1}>
											<Avatar src={r?.realty?.mainPhoto}/>
											<Typography>
												{r?.realty?.title}
											</Typography>
										</Stack>
									</TableCell>
									<TableCell>с <u>{dayjs(r?.booking?.startDate).format('DD-MM-YYYY')}</u> по <u>{dayjs(r?.booking?.endDate).format('DD-MM-YYYY')}</u></TableCell>
									<TableCell><Stack direction={'row'} alignItems={'center'} spacing={.1}><Typography>{r?.rating}</Typography> <MdStarBorder size={18} color={indigo[500]}/></Stack></TableCell>
									<TableCell>{dayjs(r.createdAt).format('DD-MM-YYYY')}</TableCell>
								</TableRow>
								<Collapse in={r.id === openReview} timeout="auto" unmountOnExit>
									<Stack spacing={1} margin={2}>
										{getReviewMarkup(r)}
										<Stack direction='row' alignItems={'center'} spacing={1}>
											<div  className="rounded-full bg-green-700">
												<IconButton onClick={() => approveReview(r?.id)}>
													<IoCheckmark color="white"/>
												</IconButton>
											</div>
											<div  className="rounded-full bg-red-600">
												<IconButton onClick={() => {
													setRejectReviewOpen(r?.id);

													console.log(r?.id === rejectReviewOpen)
												}}>
													<MdOutlineCancel color="white"/>
												</IconButton>
												<ConfirmationDialog
													title="Почему отзыв вам не понравился?"
													content={
														<>
															<div className="border-solid border-indigo-200 border-[1px] rounded-md">
																{getReviewMarkup(r)}
																<br/>
															</div>

															<TextField
																placeholder="Причины отказа публикации"
																multiline
																rows={4}
																fullWidth
																style={{marginTop: '10px'}}
																onChange={(e) => setRejectNotes(e.target?.value)}
															/>
														</>
													}
													open={r.id === rejectReviewOpen}
													primaryAction={() => rejectReview(r?.id, rejectNotes ?? '')}
													secondaryAction={() => setRejectReviewOpen(null)}
													primaryLabel="Отклонить"
													secondaryLabel="Отмена"
												/>
											</div>
										</Stack>
									</Stack>
								</Collapse>
							</>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		);
	}

	if (currentSection === Sections.REALTIES) {
		bodyContent = (
			<TableContainer component={Paper}>
				<TextField
					placeholder="Поиск по ID"
					fullWidth
					size="small"
					variant="filled"
					style={{paddingBottom: 2}}
					onChange={(e) => {
						const id = e.target.value;
						if (id) {
							setFilteredRealties((list) => list?.filter(r => String(r.id).startsWith(id)))
						} else {
							setFilteredRealties(realties);
						}
					}}
				/>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Уникальный ID</TableCell>
							<TableCell>Недвижимость</TableCell>
							<TableCell>Статус</TableCell>
							<TableCell>
								Дата создания
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{realties?.length === 0 && (<Typography variant="h6" style={{margin: 15}}>Пока нет публикаций...</Typography>)}
						{filteredRealties?.map((r: any) => (
							<>
								<TableRow className="hover:bg-indigo-100 cursor-pointer transition-all" onClick={() => setOpenRealty((v) => v === r.id ? null : r.id)}>
									<TableCell><i>{r?.id}</i></TableCell>
									<TableCell>
										<Stack direction={'row'} alignItems={'center'} spacing={1}>
											<Avatar src={r?.mainPhoto}/>
											<Typography>
												{r?.title}
											</Typography>
										</Stack>
									</TableCell>
									<TableCell>
										<Chip label={RealtyStatusMap[r?.status] || r?.status} color={r?.status === 'REJECTED' ? 'error' : 'default'}/>
									</TableCell>
									<TableCell>{dayjs(r.createdAt).format('DD-MM-YYYY')}</TableCell>
								</TableRow>
								<TableRow  style={{padding: 0, margin: 0}}>
									<TableCell colSpan={5} style={{padding: 0, margin: 0}}>
										<Collapse in={r.id === openRealty} timeout="auto" unmountOnExit>
											<Stack spacing={2} margin={2}>
												<div>
													<TextHeader text={"Изображения"} />
													<div
															style={{
															marginLeft: 15,
															maxHeight: 300,
															width: '100%',
															position: 'relative',
															display: 'flex',
															gap: 0,
															overflowX: 'auto',
															scrollSnapType: 'x mandatory',
														}}
													>
														<div style={{
																scrollSnapAlign: 'start',
																flex: '0 0 160px',
																margin: '0 10px',
															}}>
															<ImageSettings
																src={r.mainPhoto}
																width={300}
																height={300}												
															/>
														</div>
														{r.images?.map((image) => (
															<div
																style={{
																	scrollSnapAlign: 'start',
																	flex: '0 0 160px',
																	margin: '0 10px'
																}}
															>
																<ImageSettings
																	src={image}
																	width={300}
																	height={300}												
																/>
															</div>
														))}
													</div>
												</div>

												<div>
													<TextHeader text="Описание" />
													<div className="m-2 p-1">
														{containsHTML(r?.description) ? (
															<div
																dangerouslySetInnerHTML={{
																	__html: r.description
																}} 
															/>
														) : (
															<Typography variant="body1">{r.description}</Typography>
														)}
													</div>
												</div>

												<Stack direction={'row'} spacing={1} style={{borderTop: '2px solid #gray', paddingTop: 10}}>
													<div  className="rounded-full bg-green-700">
														<IconButton onClick={() => approveRealty(r?.id)}>
															<IoCheckmark color="white"/> <div className="font-thin text-white ml-1">Одобрить</div>
														</IconButton>
													</div>
													<div  className="rounded-full bg-red-600">
														<IconButton onClick={() => {
															setRejectRealtyOpen(r?.id);
														}}>
															<MdOutlineCancel color="white"/> <div className="font-thin text-white ml-1">Отклонить</div>
														</IconButton>
														<ConfirmationDialog
															title="Расскажите, что Вам не понравилось?"
															content={
																<>
																	<TextField
																		placeholder="Причины отказа в публикации объявления"
																		multiline
																		rows={4}
																		fullWidth
																		style={{marginTop: '10px'}}
																		onChange={(e) => setRejectNotes(e.target?.value)}
																	/>
																</>
															}
															open={r.id === rejectRealtyOpen}
															primaryAction={() => rejectRealty(r?.id, rejectNotes ?? '')}
															secondaryAction={() => setRejectRealtyOpen(null)}
															primaryLabel="Отклонить"
															secondaryLabel="Отмена"
														/>
													</div>
												</Stack>
											</Stack>
										</Collapse>
									</TableCell>
								</TableRow>
							</>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		);
	}

	const blockUser = (userId: string, reason: string) => {
		return blockUserReq(userId, reason)
			.then((res) => {
				toast.success('Блокировка прошла успешно. Уведомление отправлено');
				setRejectNotes(null);
				setUsers((users: any[]) => users.map((u: any) => {
					if (u.id === res?.data?.id) {
						return res.data;
					}

					return u;
				}));
				setBlockUserOpen(null);
			})
	}

	const unblockUser = (userId: string) => {
		return unblockUserReq(userId)
			.then((res) => {
				toast.success('Пользователь разблокирован');
				setRejectNotes(null);
				setUsers((users: any[]) => users.map((u: any) => {
					if (u.id === res?.data?.id) {
						return res.data;
					}

					return u;
				}));
			})
	}

	if (currentSection === Sections.USERS) {
		bodyContent = (
			<TableContainer component={Paper}>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell>Имя</TableCell>
							<TableCell>Почта</TableCell>
							<TableCell>Роль</TableCell>
							<TableCell>Статус</TableCell>
							<TableCell>Дата регистрации</TableCell>
							<TableCell>Дейтсвия</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users?.map((user: any) => (
							<TableRow>
								<TableCell>{user.firstName} {user.middleName} {user.lastName}</TableCell>
								<TableCell>{user.email} {user.email_verified_at ? (<Chip label={`Подтвержден ${dayjs(user.email_verified_at).format('DD-MM-YYYY')}`}/>) : (<Chip label="Не подтвержден"/>)}</TableCell>
								<TableCell>{user.role}</TableCell>
								<TableCell>{UserStatusMap[user.status] ?? user.status}</TableCell>
								<TableCell>{dayjs(user.createdAt).format('DD-MM-YYYY')}</TableCell>
								<TableCell>
									<IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
										<GiHamburgerMenu />
									</IconButton>
									<Menu
										style={{marginTop: 10}}
										id="basic-menu"
										anchorEl={anchorEl}
										open={!!anchorEl}
										onClose={() => {}}
										MenuListProps={{
										'aria-labelledby': 'basic-button',
										}}
									>
										<MenuItem onClick={() => setAnchorEl(null)} style={{
											backgroundColor: 'rgba(255,200,200,0.5)'
										}}>
											<Typography color={'red'}><i>Закрыть</i></Typography>
										</MenuItem>
										<MenuItem onClick={() => {
											if (user.status === 'BLOCKED') {
												unblockUser(user.id);
												return;
											}
											setBlockUserOpen(user.id);
										}}>{user.status === 'BLOCKED' ? 'Разблокировать' : 'Заблокировать'}</MenuItem>
										<MenuItem onClick={() => {}}>Заблокировать публикации</MenuItem>
										<MenuItem onClick={() => {
											sendVerificationLetter(user.id)
												.then(res => {
													toast.success('Письмо успешно отправлено!')
												})
												.catch(err => {
													toast.error('Произошла ошибка с почтовым сервисом. Поробуйте позже')
												});
										}}>Отправить письмо для активации</MenuItem>
										<MenuItem onClick={() => {}}>Дать права администратора</MenuItem>
									</Menu>
									<ConfirmationDialog
										open={user.id === blockUserOpen}
										title={"Почему мы хотите ограничить пользователю доступ к сайту?"}
										content={<>
											<TextField
												placeholder="Причина блокировки"
												multiline
												fullWidth
												rows={5}
												onChange={(e) => {
													setRejectNotes(e.target.value);
												}}
											/>
										</>}
										primaryAction={() => {
											blockUser(user.id, rejectNotes);
										}}
										secondaryAction={() => setBlockUserOpen(null)}
										primaryLabel={"Заблокировать"}
										secondaryLabel={"Отменить"}										
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		);
	}

	return ( 
		<ClientOnly>
			<Container>
				<Grid container spacing={2}>
					<Grid item xs={isMobile ? 12 : 3}>
						<List className="border-solid border-indigo-200 border-[1px] rounded-md">
							<ListItem>
								<ListItemButton onClick={() => setCurrentSection(Sections.REVIEWS)}>
									Отзывы на модерации ({reviews.length})
								</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton onClick={() => setCurrentSection(Sections.REALTIES)}>
									Модерация публикаций об аренде ({realties.length})
								</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton onClick={() => setCurrentSection(Sections.USERS)}>
									Список пользователей
								</ListItemButton>
							</ListItem>
						</List>
					</Grid>
					<Grid item xs={isMobile ? 12 : 9}>
						{bodyContent}
					</Grid>
				</Grid>
			</Container>
		</ClientOnly>
	 );
}
 
export default AdminPanel;