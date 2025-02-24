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
	const [member1, setMember1] = useState('');
	const [member2, setMember2] = useState('');
	const [member3, setMember3] = useState('');

	const [selectedOption, setSelectedOption] = useState(null);
	const [selectedCollege, setSelectedCollege] = useState(null);
	const [selectedDepartment, setSelectedDepartment] = useState(null);
	const [selectedAdviser, setSelectedAdviser] = useState(null);

	const collegeOptions = [
		{
			value: 'CTHM',
			label: 'College of Tourism, Hospitality, Business, and Management',
		},
		{ value: 'CTE', label: 'College of Teacher Education' },
		{ value: 'CAS', label: 'College of Arts and Sciences' },
		{ value: 'CCIS', label: 'College of Computing and Information Sciences' },
		{ value: 'CCJE', label: 'College of Criminal Justice Education' },
	];

	const courseOptions = {
		CTHM: [
			{ value: 'HRM', course: 'BS in Hotel and Restaurant Management' },
			{ value: 'TM', course: 'BS in Tourism Management' },
		],
		CTE: [
			{ value: 'ElemEd', course: 'Bachelor of Elementary Education' },
			{ value: 'SecEd', course: 'Bachelor of Secondary Education' },
		],
		CCIS: [
			{ value: 'CS', course: 'BS in Computer Science' },
			{ value: 'IT', course: 'BS in Information Technology' },
		],
		CCJE: [{ value: 'Crim', course: 'BS in Criminology' }],
	};

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

			<div className="flex flex-col justify-center bg-white w-[90%] md:w-[60%] lg:w-[40%] rounded-lg mx-auto p-8">
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

				<label className="mb-2 text-sm font-medium text-gray-700">
					Group Members
				</label>

				<TRSInput
					// label={'Member 1'}
					placeholder={'Enter your Member 1 Name'}
					value={member1}
					onChange={(e) => setMember1(e.target.value)}
				/>

				<TRSInput
					// label={'Member 2'}
					placeholder={'Enter your Member 2 Name'}
					value={member2}
					onChange={(e) => setMember2(e.target.value)}
				/>

				<TRSInput
					// label={'Member 3'}
					placeholder={'Enter your Member 3 Name'}
					value={member3}
					onChange={(e) => setMember3(e.target.value)}
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
					onSelect={setSelectedCollege}
				/>
				<TRSDropdown
					label="Course"
					options={courseOptions}
					onSelect={setSelectedOption}
				/>
				<TRSDropdown
					label="Adviser"
					options={adviserOptions}
					onSelect={setSelectedAdviser}
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
