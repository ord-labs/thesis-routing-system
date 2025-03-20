'use client';

import { ChevronDown, CircleCheck, CircleXIcon, Ellipsis } from 'lucide-react';
import { useEffect, useState } from 'react';
import Modal from '../modal/Modal';
import { IKImage } from 'imagekitio-next';
import Accordion from '../accordion/Accordion';
import { useThesisStore } from '../../stores/useThesisStore';

const StudentFileCard = ({ pdfUrl, paperId, onDelete }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [openCommentIndex, setOpenCommentIndex] = useState(null);
	const [comments, setComments] = useState([{}]);
	const [isLoading, setIsLoading] = useState(false);

	const { getThesisComment, deletePaper, loading, getThesisByStudentAndRoute } =
		useThesisStore((state) => state);

	const thumbnailUrl = `${pdfUrl}/ik-thumbnail.jpg`;

	const getFilenameFromUrl = (url) => {
		return url.substring(url.lastIndexOf('/') + 1);
	};

	const toggleMenu = async () => {
		try {
			setIsLoading(true);
			const fetchedComments = await getThesisComment(paperId);

			setComments(Array.isArray(fetchedComments) ? fetchedComments : []);
		} catch (error) {
			console.error('Error fetching comments:', error);
			setComments([]);
		} finally {
			setIsMenuOpen(true);
			setIsLoading(false);
		}
	};

	const toggleComment = (index) => {
		setOpenCommentIndex(openCommentIndex === index ? null : index);
	};

	const handleDelete = async () => {
		await deletePaper(paperId);
		onDelete();
		setIsMenuOpen(false);
	};

	return (
		<div className="w-[90%] bg-white md:w-80 flex flex-col items-center  border shadow-md  rounded-lg ">
			<a
				href={pdfUrl}
				className=" w-full flex items-center h-[400px] rounded-t-lg"
				target="_blank"
				rel="noopener noreferrer"
			>
				<img
					src={thumbnailUrl}
					alt="PDF Preview"
					className="rounded-t-lg  w-full"
					onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
				/>
			</a>

			<div className="flex flex-col p-2 w-full bg-white text-smccprimary border-t border-gray-300 rounded-b-lg">
				<p className="truncate font-semibold">{getFilenameFromUrl(pdfUrl)}</p>

				<button
					className="flex justify-center mt-2 items-center p-1 rounded-lg text-center bg-smccprimary"
					onClick={(e) => {
						e.stopPropagation();
						toggleMenu();
					}}
				>
					<p className="text-xs p-1 text-white">
						{isLoading ? 'Fetching details...' : 'View Details'}
					</p>
				</button>
			</div>

			<Modal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
				<h2 className="text-xl font-semibold text-smccprimary mb-4">Details</h2>
				<div className="flex flex-col gap-7 p-3 bg-white rounded-lg">
					{comments.length > 0 ? (
						comments.map((comment, index) => (
							<div key={index} className="flex flex-col gap-3">
								<div className="flex justify-between">
									<div className="flex gap-2">
										<ChevronDown
											className="cursor-pointer"
											onClick={() => toggleComment(index)}
										/>
										<p className="font-semibold text-smccprimary">
											{comment.name}
										</p>
									</div>
									{comment.position ? (
										comment.approved ? (
											<span className="text-green-500 flex items-center">
												<CircleCheck className="mr-1" /> Approved
											</span>
										) : (
											<span className="text-red-500 flex items-center">
												<CircleXIcon className="mr-1" /> Not Approved
											</span>
										)
									) : null}
								</div>
								<Accordion isCommentOpen={openCommentIndex === index}>
									<div className="pl-3 border border-gray-300 rounded-lg text-black bg-white space-y-2 py-2">
										{comment.comment}
									</div>
								</Accordion>
							</div>
						))
					) : (
						<p>No comments found.</p>
					)}
				</div>
				<button
					className="w-full p-2 mt-5 text-white bg-red-600 hover:bg-red-700 rounded-lg"
					onClick={handleDelete}
				>
					Delete
				</button>
			</Modal>
		</div>
	);
};

export default StudentFileCard;
