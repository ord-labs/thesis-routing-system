'use client';

import React, { useState } from 'react';
import TRSButton from '../../../../components/button/TRSButton';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import TRSInput from '../../../../components/input/TRSInput';
import Link from 'next/link';
import TRSDropdown from '../../../../components/input/TRSDropdown';
import { useAuthStore } from '../../../../stores/useAuthStore';
import { panelModel } from '../../../../models/panelModel';

const Page = () => {
	const router = useRouter();

	const [idnumber, setIdnumber] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [department, setDepartment] = useState('');
	const [position, setPosition] = useState('');
	const [registerLoading, setRegisterLoading] = useState(false);

	const { registerPanel } = useAuthStore((state) => state);
	const departmentOptions = [
		{ value: 'CTHM', label: 'College of Tourism, Hospitality, Business, and Management' },
		{ value: 'CTE', label: 'College of Teacher Education' },
		{ value: 'CAS', label: 'College of Arts and Sciences' },
		{ value: 'CCIS', label: 'College of Computing and Information Sciences' },
		{ value: 'CCJE', label: 'College of Criminal Justice Education' },
	];

	const positionOptions = [
		{ value: 'panel1', label: 'Panel 1' },
		{ value: 'panel2', label: 'Panel 2' },
		{ value: 'panel3', label: 'Panel 3' },
		{ value: 'panel4', label: 'Panel 4' },
	];

	const handleRegister = async () => {
		if (password !== confirmPassword) {
			alert('Passwords do not match');
			return;
		}
		if (!idnumber || !name || !password || !confirmPassword || !department || !position) {
			alert('Please fill in all fields');
			return;
		}
		setRegisterLoading(true);
		try {
			await registerPanel(idnumber, password, 
				panelModel(
					idnumber,
					name,
					department,
					position,
				)
			);
			setIdnumber('');
			setName('');
			setPassword('');
			setConfirmPassword('');
			setDepartment('');
			setPosition('');
			router.push('/admin/register/panel');
		} catch (error) {
			alert(`Registration Error: ${error.message}`);
		}
		setRegisterLoading(false);
	};

	return (
		<>
			<div className="flex items-center justify-center min-h-screen p-4">
				<div className="bg-white shadow-md rounded-lg w-full max-w-md p-8">
					<h1 className="text-lg font-semibold text-center text-gray-800 mb-6">Register as Panel</h1>

					<TRSInput label="Employee ID" placeholder="Enter your ID Number" value={idnumber} onChange={(e) => setIdnumber(e.target.value)} />
					<TRSInput label="Password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
					<TRSInput label="Confirm Password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" />
					<TRSInput label="Complete Name" placeholder="Enter your Complete Name" value={name} onChange={(e) => setName(e.target.value)} />
					<TRSDropdown label="College" options={departmentOptions} onSelect={setDepartment} value={department} /> {/* Ensure the value is controlled */}
					<TRSDropdown label="Position" options={positionOptions} onSelect={setPosition} value={position} /> {/* Ensure the value is controlled */}

					<div className="mt-6 text-center">
						<TRSButton 
							label={`${registerLoading ? 'Submitting....' : 'Submit Register'}`} 
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
