'use client';

import React, { useEffect, useState } from 'react';
import TRSButton from '../../../components/button/TRSButton';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FormInput } from 'lucide-react';
import TRSInput from '../../../components/input/TRSInput';
import { useAuthStore } from '../../../stores/useAuthStore';
import Cookies from 'js-cookie';

const Page = () => {
	const router = useRouter();

	const [idnumber, setIdnumber] = useState('');
	const [password, setPassword] = useState('');

	const { loginPanel } = useAuthStore((state) => state);

	const handleLogin = async (e) => {
		e.preventDefault();

		await loginPanel(idnumber, password).then((res) => {
			if (res) {
				Cookies.set('accessToken', res.accessToken);
				Cookies.set('panelId', res.id);
				Cookies.set('role', 'panel');

				router.push('/panel/proposal/route-1');
			} else {
				alert('Invalid email or password.');
			}
		});
	};
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

			<div className="flex flex-col justify-center bg-white w-[90%] md:w-[60%] lg:w-[40%] rounded-lg mx-auto p-8">
				<h1 className="text-center font-semibold text-xl mb-8">Panel Login</h1>
				<TRSInput
					label={'ID Number'}
					placeholder={'Enter your ID Number'}
					value={idnumber}
					onChange={(e) => setIdnumber(e.target.value)}
				/>
				<TRSInput
					label={'Password'}
					placeholder={'Enter your password'}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					type="password"
				/>
				<TRSButton label={'Login'} onClick={handleLogin} />
			</div>
		</div>
	);
};

export default Page;
