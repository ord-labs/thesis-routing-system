'use client';

import Image from 'next/image';
import TRSButton from '../components/button/TRSButton';
import { useRouter } from 'next/navigation';

export default function Home() {
	const router = useRouter();

	const buttonData = [
		{
			label: 'Student',
			onClick: () => {
				router.push('/auth/student');
			},
		},
		{
			label: 'Panel',
			onClick: () => {
				router.push('/auth/panel');
			},
		},
		{
			label: 'Adviser',
			onClick: () => {
				router.push('/auth/adviser');
			},
		},
		{
			label: 'Admin',
			onClick: () => {
				router.push('/auth/admin');
			},
		},
	];

	return (
		<div className="flex flex-col justify-center gap-y-8 bg-smccprimary  w-full h-screen">
			<div className="flex gap-x-4 justify-center items-center">
				<Image
					width={100}
					height={100}
					src={'/smcc-logo-2.png'}
					alt="SMCC Logo"
				/>
				<div className="flex-col text-white">
					<h1 className="font-semibold text-2xl ">
						Saint Michael's College of Caraga
					</h1>
					<p>Brgy. 4, Atupan St., Nasipit, Agusan del Norte</p>
				</div>
			</div>

			<h1 className="text-center font-bold text-white text-2xl">
				THESIS ROUTING SYSTEM
			</h1>

			<div className="flex flex-col justify-center bg-white w-[40%] rounded-lg mx-auto p-8">
				<p className="text-center font-semibold mb-2">Select User Type</p>
				{buttonData.map((data, index) => (
					<TRSButton
						key={`button-${index}`}
						label={data.label}
						onClick={data.onClick}
					/>
				))}
			</div>
		</div>
	);
}
