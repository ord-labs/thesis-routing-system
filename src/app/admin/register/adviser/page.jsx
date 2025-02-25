'use client';

import React, { useState } from 'react';
import TRSButton from '../../../../components/button/TRSButton';
import { useRouter } from 'next/navigation';
import TRSInput from '../../../../components/input/TRSInput';
import TRSDropdown from '../../../../components/input/TRSDropdown';
import { useAuthStore } from '../../../../stores/useAuthStore';

const Page = () => {
	const router = useRouter();
	const [idnumber, setIdnumber] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [department, setDepartment] = useState('');

	const registerUser = useAuthStore((state) => state.registerUser);

	const departmentOptions = [
		{ value: 'CTHM', label: 'College of Tourism, Hospitality, Business, and Management' },
		{ value: 'CTE', label: 'College of Teacher Education' },
		{ value: 'CAS', label: 'College of Arts and Sciences' },
		{ value: 'CCIS', label: 'College of Computing and Information Sciences' },
		{ value: 'CCJE', label: 'College of Criminal Justice Education' },
	];

	const handleRegister = async () => {
		await registerUser(idnumber, password, 'adviser', {
			idnumber,
			name,
			department,
		});
		router.push('/admin');
	};

	return (
		<>
			<div className="flex items-center justify-center min-h-screen p-4">
				<div className="bg-white shadow-md rounded-lg w-full max-w-md p-8">
					<h1 className="text-lg font-semibold text-center text-gray-800 mb-6">Register as Adviser</h1>

					<div className="space-y-4">
						<TRSInput 
							label="Employee ID" 
							placeholder="Enter your ID Number" 
							value={idnumber} 
							onChange={(e) => setIdnumber(e.target.value)} 
						/>
						<TRSInput 
							label="Password" 
							placeholder="Enter your password" 
							value={password} 
							onChange={(e) => setPassword(e.target.value)} 
							type="password" 
						/>
						<TRSInput 
							label="Confirm Password" 
							placeholder="Confirm your password" 
							value={confirmPassword} 
							onChange={(e) => setConfirmPassword(e.target.value)} 
							type="password" 
						/>
						<TRSInput 
							label="Complete Name" 
							placeholder="Enter your Complete Name" 
							value={name} 
							onChange={(e) => setName(e.target.value)} 
						/>
						<TRSDropdown 
							label="College" 
							options={departmentOptions} 
							onSelect={setDepartment} 
						/>
					</div>

					<div className="mt-6">
						<TRSButton 
							label="Submit Registration" 
							onClick={handleRegister} 
							className="w-full bg-smccprimary text-white py-2 rounded-lg hover:bg-blue-700 transition hover:shadow-lg"
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default Page;
