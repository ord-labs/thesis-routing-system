'use client';

import React, { useEffect, useState } from 'react';
import TRSButton from '../../../../components/button/TRSButton';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FormInput } from 'lucide-react';
import TRSInput from '../../../../components/input/TRSInput';
import Link from 'next/link';
import TRSDropdown from '../../../../components/input/TRSDropdown';
import { useAuthStore } from '../../../../stores/useAuthStore';
import { studentModel } from '../../../../models/studentModel';
import Cookies from 'js-cookie';

const Page = () => {
	const router = useRouter();

	const [idnumber, setIdnumber] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [memberCount, setMemberCount] = useState(1);
	const [membersList, setMembersList] = useState([]);
	const [schoolYear, setSchoolYear] = useState('');
	const [selectedOption, setSelectedOption] = useState('');
	const [selectedCollege, setSelectedCollege] = useState('');
	const [selectedCourse, setSelectedCourse] = useState('');
	const [selectedAdviser, setSelectedAdviser] = useState('');
	const [selectedGroupNumber, setSelectedGroupNumber] = useState('');

	const [passwordMatched, setPasswordMatched] = useState(false);
	const [adviserOptions, setAdviserOptions] = useState(false);

	const {
		loginStudent,
		registerStudent,
		getCurrentUser,
		getAdvisers,
		advisers,
		loginLoading,
		setLoginLoading,
	} = useAuthStore((state) => state);

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
			{ value: 'HRM', label: 'BS in Hotel and Restaurant Management' },
			{ value: 'TM', label: 'BS in Tourism Management' },
		],
		CTE: [
			{ value: 'ElemEd', label: 'Bachelor of Elementary Education' },
			{ value: 'SecEd', label: 'Bachelor of Secondary Education' },
		],
		CCIS: [
			{ value: 'CS', label: 'BS in Computer Science' },
			{ value: 'IT', label: 'BS in Information Technology' },
		],
		CCJE: [{ value: 'Crim', label: 'BS in Criminology' }],
		CAS: [{ value: 'English', label: 'AB in English' }],
	};

	const handleRegister = async () => {
		setLoginLoading(true);
		const currentUser = getCurrentUser();

		await registerStudent(
			idnumber,
			password,
			studentModel(
				idnumber,
				name,
				schoolYear,
				selectedCourse,
				selectedCollege,
				selectedAdviser,
				selectedGroupNumber,
				membersList
			)
		);

		await loginStudent(idnumber, password).then((res) => {
			if (res) {
				Cookies.set('studentId', res.id);
				Cookies.set('role', 'student');

				router.push('/student/proposal/route-1');
			} else {
				alert('Invalid email or password.');
			}
		});

		setLoginLoading(false);
	};

	useEffect(() => {
		console.log(membersList);
	}, [membersList]);

	useEffect(() => {
		if (password === confirmPassword) {
			setPasswordMatched(true);
		} else {
			setPasswordMatched(false);
		}
	}, [confirmPassword]);

	useEffect(() => {
		getAdvisers();
	}, []);

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
					label={'Password (at least 6 characters)'}
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

				<p className="-mt-2 text-red-500 text-xs">
					{!passwordMatched & (confirmPassword != '')
						? 'Passwords do not match.'
						: ''}
				</p>

				<p className="text-center font-semibold text-smccprimary">
					Researcher Info
				</p>

				<TRSInput
					label={'Complete Name'}
					placeholder={'Enter your Complete Name'}
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>

				<div className="flex justify-between items-center mb-2">
					<div>
						<label className="mb-2 text-sm font-medium text-gray-700">
							Group Members
						</label>
					</div>
					<div>
						<button
							className="text-sm bg-smccprimary text-white px-2 py-2 rounded-lg hover:bg-blue-600"
							onClick={() => setMemberCount(memberCount + 1)}
						>
							+ Add Members
						</button>
					</div>
				</div>

				{Array.from({ length: memberCount }).map((_, index) => {
					return (
						<TRSInput
							key={index}
							placeholder={`Enter your Member ${index + 1} Name`}
							value={membersList[index] || ''}
							onChange={(e) => {
								const updatedMembersList = [...membersList];
								updatedMembersList[index] = e.target.value;
								setMembersList(updatedMembersList);
							}}
						/>
					);
				})}

				<TRSInput
					label={'School Year'}
					placeholder={'Enter school year'}
					value={schoolYear}
					onChange={(e) => setSchoolYear(e.target.value)}
				/>

				<TRSDropdown
					label="College"
					options={collegeOptions}
					onSelect={setSelectedCollege}
				/>	
				{selectedCollege !== '' && (
					<TRSDropdown
						label="Course"
						options={courseOptions[selectedCollege.value]}
						onSelect={setSelectedCourse}
					/>
				)}
				<TRSDropdown
					label="Adviser"
					options={advisers}
					onSelect={setSelectedAdviser}
				/>

				<TRSInput
					label={'Group Number'}
					placeholder={'Enter your group number'}
					value={selectedGroupNumber}
					onChange={(e) => setSelectedGroupNumber(e.target.value)}
				/>

				<TRSButton
					label={`${
						loginLoading ? 'Submitting registration...' : 'Submit Registration'
					}`}
					disabled={
						!idnumber ||
						!name ||
						!password ||
						!confirmPassword ||
						!membersList ||
						!schoolYear ||
						!selectedCollege ||
						!selectedCourse ||
						!selectedAdviser ||
						!selectedGroupNumber ||
						!passwordMatched
					}
					onClick={handleRegister}
				/>
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
