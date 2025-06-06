'use client';

import { MessageSquare, FileText, Check, XCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Modal from '../modal/Modal';
import { useThesisStore } from '../../stores/useThesisStore';
import { commentModel } from '../../models/commentModel';
import Cookies from 'js-cookie';
import { log } from 'util';
import TRSButton from '../button/TRSButton';

const PanelAdFileCard = ({ pdfUrl, paperId, role }) => {
	const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
	const [selectedComment, setSelectedComment] = useState(null);
	const [comment, setComment] = useState('');
	const [allComments, setAllComments] = useState([]);
	const [isLoadingComments, setIsLoadingComments] = useState(false);
	const [isApproved, setIsApproved] = useState(false);
	const [thumbnailUrl, setThumbnailUrl] = useState('');
	const [paperDetails, setPaperDetails] = useState(null);

	const {
		createThesisComment,
		updateApproveStatus,
		getStatus,
		getThesisComment,
		getCurrentPaper,
		checkExpiryDate
	} = useThesisStore((state) => state);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');

	if (role === 'panel') {
		setInterval(() => {
		  checkExpiryDate(paperId, Cookies.get('panelId'));
		}, 60000);
	}

	useEffect(() => {
		if (pdfUrl) {
			setThumbnailUrl(`${pdfUrl}/ik-thumbnail.jpg`);
		} else {
			setThumbnailUrl(null);
		}
	}, [pdfUrl]);

	const getPaper = useCallback(async () => {
		const paper = await getCurrentPaper(paperId);
		setPaperDetails(paper);
	}, [getCurrentPaper, paperId]);

	useEffect(() => {
		getPaper();
	}, [getPaper]);

	const handleOpenFullComment = (commentItem) => {
		setSelectedComment(commentItem);
	};

	const getFilenameFromUrl = (url) => {
		return url.substring(url.lastIndexOf('/') + 1);
	};

	const extractInfoFromFilename = (filename) => {
		// Remove file extension
		const filenameWithoutExt = filename.replace(/\.[^/.]+$/, '');

		// Split the filename by underscores
		let parts = filenameWithoutExt.split('_');

		// If there's an extra part beyond the expected 3,
		// and that extra part is not a valid date, remove it.
		// (This only removes one trailing part; see below for handling multiple.)
		if (parts.length > 3) {
			const lastPart = parts[parts.length - 1];
			if (!/^\d{4}-\d{2}-\d{2}$/.test(lastPart)) {
				parts.pop(); // Ignore it
			}
		}

		// Default values
		let groupNumber = paperDetails?.groupNumber;
		let projectTitle = paperDetails?.title;
		let submittedOn = new Date().toISOString().split('T')[0];

		// Extracting Info
		if (parts.length >= 3) {
			// Format: Group1_ProjectTitle_Date
			// Example: Group1_ESP32WiFiServers_2025-01-25.pdf
			projectTitle = parts.slice(1, -1).join(' ');

			// Try to parse the last part as a date
			const potentialDate = parts[parts.length - 1];
			if (/^\d{4}-\d{2}-\d{2}$/.test(potentialDate)) {
				submittedOn = potentialDate;
			}
		}

		return { groupNumber, projectTitle, submittedOn };
	};

	const filename = getFilenameFromUrl(pdfUrl);
	const { groupNumber, projectTitle, submittedOn } =
		extractInfoFromFilename(filename);

	const handleCommentSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			const result = await createThesisComment(
				commentModel(paperId, comment),
				role,
				Cookies.get(`${role}Id`),
				paperId,
				isApproved
			);
			setComment('');
			setIsCommentsModalOpen(false);
			setSuccessMessage('Comment submitted successfully!');
			// Auto-dismiss the success message after 3 seconds
			setTimeout(() => {
				setSuccessMessage('');
			}, 3000);
		} catch (error) {
			console.error('Error creating comment:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleFetchComments = async () => {
		setIsCommentsModalOpen(true);
		setIsLoadingComments(true);
		setAllComments([]);

		try {
			const comments = await getThesisComment(paperId);
			setAllComments(comments);
		} catch (error) {
			console.error('Error fetching comments:', error);
		} finally {
			setIsLoadingComments(false);
		}
	};

	useEffect(() => {
		const fetchApprovalStatus = async () => {
			try {
				const role = Cookies.get('role');
				const panelId = Cookies.get('panelId');
				if (!role || !panelId || !paperId) {
					throw new Error('Missing required parameters');
				}
				const status = await getStatus(role, panelId, paperId);

				setIsApproved(status ?? false); // Default to false if null
			} catch (error) {
				console.error('Error fetching approval status:', error.message);
			}
		};

		const role = Cookies.get('role');
		const panelId = Cookies.get('panelId');
		if (role && panelId && paperId) {
			fetchApprovalStatus();
		}
	}, [paperId]);

	const handleApproveStatus = async () => {
		const newStatus = !isApproved;
		setIsApproved(newStatus);

		await updateApproveStatus(
			Cookies.get('role'),
			Cookies.get('panelId'),
			paperId,
			newStatus
		);
	};

	return (
		<div className="w-[90%] md:w-80 flex flex-col items-center border shadow-md rounded-lg">
			{/* <div className="w-full flex justify-end p-2 bg-white rounded-t-lg border-b border-gray-300">
				<MessageSquare
					size={30}
					className="text-smccprimary cursor-pointer mx-1"
					onClick={(e) => {
						e.stopPropagation();
						handleFetchComments();
					}}
				/>
			</div> */}

			{/* Toast Notification */}
			{successMessage && (
				<div
					className={`
                        fixed bottom-4 right-4 z-50 
                        bg-green-500 text-white 
                        px-6 py-3 rounded-lg shadow-lg 
                        transition-all duration-1000 ease-in-out
                        transform ${
													successMessage
														? 'translate-x-0 opacity-100'
														: 'translate-x-full opacity-0'
												}
                    `}
				>
					{successMessage}
				</div>
			)}

			<a
				href={pdfUrl}
				className="w-full flex items-center h-[400px] border-b border-gray-300 bg-white rounded-t-lg"
				target="_blank"
				rel="noopener noreferrer"
			>
				{thumbnailUrl ? (
					<img
						src={thumbnailUrl || 'https://via.placeholder.com/150'}
						alt="PDF Preview"
						className="w-full"
						onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center bg-gray-200">
						<span>No Preview Available</span>
					</div>
				)}
			</a>

			<div className="flex flex-col w-full bg-white text-white rounded-b-lg p-2">
				<p className="truncate text-smccprimary font-semibold">{filename}</p>
				<button
					className="flex justify-center items-center p-1 rounded-lg text-center bg-smccprimary mt-2"
					onClick={(e) => {
						e.stopPropagation();
						handleFetchComments();
					}}
				>
					<MessageSquare size={20} className="text-white cursor-pointer mx-1" />
					<p className="text-xs">Write a comment</p>
				</button>
			</div>

			{/* Modal for posting comments */}
			<Modal
				isOpen={isCommentsModalOpen}
				onClose={() => {
					setIsCommentsModalOpen(false);
					setIsLoadingComments(false);
					setAllComments([]);
				}}
			>
				{/* Outer container: vertical layout, fixed max height */}
				<div className="flex flex-col h-[80vh] max-h-[80vh]">
					{/* Header: Title + Approve Button */}
					<div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
						<h2 className="text-xl font-semibold text-smccprimary">
							Thesis Comments
						</h2>

						{role !== 'adviser' && (
							<button
								className={`
                            flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors duration-300 ease-in-out
                            ${
															isApproved
																? 'bg-green-600 hover:bg-green-500 text-white'
																: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
														}
                            `}
								onClick={handleApproveStatus}
							>
								{isApproved ? <Check size={16} /> : <Check size={16} />}
								<span>{isApproved ? 'Paper Approved' : 'Approve Paper'}</span>
							</button>
						)}
					</div>

					{/* Main Body: Spinner OR Comments (scrollable) */}
					{isLoadingComments ? (
						// Loading Spinner occupies the middle section
						<div className="flex justify-center items-center flex-grow">
							<div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
						</div>
					) : (
						<div className="flex-grow overflow-y-auto p-4 space-y-4">
							{/* Displaying Group & Project Info */}
							<div className="mb-4 p-3 rounded">
								<p>
									<span className="font-semibold">Group Number:</span>{' '}
									{groupNumber}
								</p>
								<p>
									<span className="font-semibold">Project Title:</span>{' '}
									{projectTitle}
								</p>
								<p>
									<span className="font-semibold">Submitted On:</span>{' '}
									{submittedOn}
								</p>
							</div>

							{/* Comments Section */}
							{!isLoadingComments && (
								<div className="space-y-4">
									{allComments.map((commentItem, index) => (
										<div
											key={index}
											className="p-3 border border-gray-300 rounded-lg cursor-pointer"
											onClick={() => handleOpenFullComment(commentItem)}
										>
											<p className="font-semibold text-smccprimary">
												{commentItem.name}
											</p>
											<p className="break-words line-clamp-3">
												{commentItem.comment}
											</p>
										</div>
									))}
								</div>
							)}

							{/* Full Comment Modal */}
							{selectedComment && (
								<Modal
									isOpen={!!selectedComment}
									onClose={() => setSelectedComment(null)}
									className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-w-4xl mx-auto"
								>
									<div className="flex flex-col h-[70vh] max-h-[70vh]">
										<h3 className="text-lg font-bold mb-4 py-2 border-b border-gray-700">
											<span className="font-semibold">
												{selectedComment.position?.label ||
													selectedComment.name}
											</span>
										</h3>
										<div className="flex-grow overflow-y-auto px-2 py-4">
											<p className="whitespace-pre-wrap break-words text-base leading-relaxed">
												{selectedComment.comment}
											</p>
										</div>
										<div className="mt-4 pt-2 border-t border-gray-700">
											<button
												onClick={() => setSelectedComment(null)}
												className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300 ease-in-out"
											>
												Close
											</button>
										</div>
									</div>
								</Modal>
							)}
						</div>
					)}

					{/* Footer: Comment Form (stays pinned at bottom) */}
					<div className="p-4 border-t border-gray-300 flex-shrink-0 bg-white ">
						<form
							onSubmit={handleCommentSubmit}
							className="flex flex-col gap-3"
						>
							<textarea
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								placeholder="Write your comment here..."
								className="p-2 border rounded-lg bg-white text-black resize-none max-h-32"
								rows={3}
								required
							/>
							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full p-2 bg-smccprimary hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
							>
								{isSubmitting ? 'Submitting...' : 'Submit'}
							</button>
						</form>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default PanelAdFileCard;
