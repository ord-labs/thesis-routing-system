import { IKUpload, ImageKitProvider } from 'imagekitio-next';
import { useCallback, useEffect, useRef, useState } from 'react';
import TRSButton from './TRSButton';
import { FileUp } from 'lucide-react';
import { useThesisStore } from '../../stores/useThesisStore';
import { thesisModel } from '../../models/thesisModel';
import Cookies from 'js-cookie';
import Modal from '../modal/Modal';

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

const authenticator = async () => {
	try {
		const response = await fetch(
			'https://thesis-routing-system.netlify.app/api/auth'
		);
		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`Request failed with status ${response.status}: ${errorText}`
			);
		}
		const data = await response.json();
		return {
			signature: data.signature,
			expire: data.expire,
			token: data.token,
		};
	} catch (error) {
		throw new Error(`Authentication request failed: ${error.message}`);
	}
};

const SubmitFile = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [advisers, setAdvisers] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [chosenAdviser, setChosenAdviser] = useState({});
	const [isAdviserChosen, setIsadviserChosen] = useState(false);

	const route = useThesisStore((state) => state.getCurrentRoute());
	const { createThesis, fetchAllAdvisers } = useThesisStore((state) => state);

	const fetchAdvisers = useCallback(async () => {
		const fetchedAd = await fetchAllAdvisers();
		setAdvisers(fetchedAd);
	}, [fetchAllAdvisers]);

	useEffect(() => {
		fetchAdvisers();
	}, [isModalOpen]);

	const onError = (err) => {
		console.error('Upload Error:', err);
		alert('Error uploading file');
		setUploading(false);
	};

	const onSuccess = async (res) => {
		console.log('Upload success:', res);
		try {
			await createThesis(
				thesisModel(
					res.name,
					res.url,
					Cookies.get('studentId'),
					[],
					{
						adviserId: chosenAdviser.id,
						name: chosenAdviser.name,
					},
					route
				)
			);
			setUploading(false);
			setIsModalOpen(false);
			setChosenAdviser({});
			setIsadviserChosen(false);
		} catch (error) {
			console.error('Error uploading file:', error);
			setUploading(false);
		}
	};

	const ikUploadRef = useRef(null);

	const onFileSelect = () => {
		setUploading(true);
		setTimeout(() => {
			if (ikUploadRef.current) {
				ikUploadRef.current.click();
			}
		}, 100);
	};

	return (
		<div>
			<TRSButton onClick={() => setIsModalOpen(true)} label={<FileUp />} />
			<Modal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setChosenAdviser({});
					setUploading(false);
					setIsadviserChosen(false);
				}}
			>
				<div className="flex flex-col">
					<h2 className="text-xl font-semibold mb-3">Upload your file here</h2>
					<div className="text-sm">
						<p>
							File naming convention: Group{'<#>'}_{'<ThesisTitle>'}_
							{'<Date-Uploaded>'}.pdf
						</p>
						<p className="text-smccprimary font-semibold">
							e.g. Group1_ESP32WifiServers_2025-03-01.pdf
						</p>
					</div>
					<div className="flex bg-red-50 border border-red-400 rounded-lg p-2 mt-8">
						<p className="text-red-700">
							Choose adviser to proceed to uploading.
						</p>
					</div>
					<div className="flex flex-col gap-4 my-5 max-h-72 overflow-y-auto">
						{advisers.map((adviser) => (
							<div
								className={`${
									chosenAdviser.id === adviser.id
										? 'bg-smccprimary text-white'
										: 'bg-white border border-gray-300 text-gray-700'
								} cursor-pointer w-full p-4 rounded-lg hover:bg-gray-200`}
								onClick={() => {
									setChosenAdviser(adviser);
									setIsadviserChosen(true);
								}}
								key={adviser.id}
							>
								{adviser.name}
							</div>
						))}
					</div>
					<ImageKitProvider
						publicKey={publicKey}
						urlEndpoint={urlEndpoint}
						authenticator={authenticator}
					>
						<IKUpload
							style={{ display: 'none' }}
							useUniqueFileName
							onError={onError}
							onSuccess={onSuccess}
							ref={ikUploadRef}
							onChange={onFileSelect}
						/>
						<button
							onClick={() => ikUploadRef.current.click()}
							className={`text-sm ${
								isAdviserChosen
									? 'bg-smccprimary cursor-pointer'
									: ' bg-gray-600 pointer-events-none '
							}  w-full rounded-lg py-2 text-white`}
							type="button"
							disabled={uploading || !isAdviserChosen}
						>
							{uploading ? 'Uploading...' : 'Upload File'}
						</button>
					</ImageKitProvider>
				</div>
			</Modal>
		</div>
	);
};

export default SubmitFile;
