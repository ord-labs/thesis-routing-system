import { pdf } from '@react-pdf/renderer';
import CertificateOfEndorsement from '../pdf/CertificateOfEndorsement';

const downloadPDF = async ({ date, adviserName, studentNames }) => {
    try {
        // Create the PDF document
        const pdfDocument = (
            <CertificateOfEndorsement 
                date={date} 
                adviserName={adviserName} 
                studentNames={studentNames} 
            />
        );

        // Generate the PDF blob
        const blob = await pdf(pdfDocument).toBlob();

        // Create a download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Thesis_Endorsement.pdf';
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the object URL
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error('PDF Download Error:', error);
        alert('Failed to download PDF. Please try again.');
    }
};

export default downloadPDF;