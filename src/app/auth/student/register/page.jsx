'use client';

import React, { useEffect, useState } from 'react';
import TRSButton from '../../../../components/button/TRSButton';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FormInput } from 'lucide-react';
import TRSInput from '../../../../components/input/TRSInput';
import Link from 'next/link';
import TRSDropdown from '../../../../components/input/TRSDropdown';

const Page = () => {
	const router = useRouter();

	const [idnumber, setIdnumber] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [selectedOption, setSelectedOption] = useState(null);
	const [selectedCollege, setSelectedCollege] = useState(null);
	const [selectedDepartment, setSelectedDepartment] = useState(null);
	const [selectedAdviser, setSelectedAdviser] = useState(null);

	const collegeOptions = [
		{ value: 'cea', label: 'College of Engineering and Architecture' },
		{ value: 'cot', label: 'College of Technology' },
		{ value: 'ccs', label: 'College of Computer Studies' },
	];

	const courseOptions = [
		{ value: 'bsit', label: 'BS in Information Technology' },
		{ value: 'bsce', label: 'BS in Computer Engineering' },
		{ value: 'bscs', label: 'BS in Computer Science' },
	];

	const adviserOptions = [
		{ value: 'dr_smith', label: 'Dr. John Smith' },
		{ value: 'ms_doe', label: 'Ms. Jane Doe' },
		{ value: 'mr_lee', label: 'Mr. Robert Lee' },
	];

	useEffect(() => {
		console.log(idnumber, password);
	}, [idnumber, password]);

	return (
		<div className="flex flex-col justify-center gap-y-8 bg-smccprimary  w-full py-16">
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
				<h1 className="text-center font-semibold text-xl mb-8">
					Register as Student
				</h1>
				<TRSInput
					label={'Student ID'}
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
				<TRSInput
					label={'Confirm Password'}
					placeholder={'Confirm your password'}
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					type="password"
				/>

				<p className="text-center font-semibold text-smccprimary">
					Researcher Info
				</p>

				<TRSInput
					label={'Complete Name'}
					placeholder={'Enter your Complete Name'}
					value={idnumber}
					onChange={(e) => setIdnumber(e.target.value)}
				/>

				<TRSInput
					label={'School Year'}
					placeholder={'Enter school year'}
					value={idnumber}
					onChange={(e) => setIdnumber(e.target.value)}
				/>

				<TRSDropdown
					label="College"
					options={collegeOptions}
					onSelect={setSelectedOption}
				/>
				<TRSDropdown
					label="Course"
					options={courseOptions}
					onSelect={setSelectedOption}
				/>
				<TRSDropdown
					label="Adviser"
					options={adviserOptions}
					onSelect={setSelectedOption}
				/>

				<TRSInput
					label={'Group Number'}
					placeholder={'Enter your group number'}
					value={idnumber}
					onChange={(e) => setIdnumber(e.target.value)}
				/>

				<TRSButton label={'Submit Registration'} onClick={() => {}} />
				<p className="text-center text-sm">
					Already have an account?{' '}
					<span>
						<Link
							href="/auth/student"
							className="font-semibold text-smccprimary"
						>
							Login here
						</Link>
					</span>
				</p>
			</div>
		</div>
	);
};

export default Page;
