"use client";

import React from "react";
import dynamic from "next/dynamic";
import CertificateOfEndorsement from "../../../../components/pdf/CertificateOfEndorsement";

// Dynamically import PDF components to avoid SSR issues

const PDFViewer = dynamic(async () => {
  const mod = await import("@react-pdf/renderer");
  return mod.PDFViewer;
}, { ssr: false });

const PDFDownloadLink = dynamic(async () => {
  const mod = await import("@react-pdf/renderer");
  return mod.PDFDownloadLink;
}, { ssr: false });


const Page = () => {
  const currentDate = new Date().toLocaleDateString();
  const adviserName = "John Doe"; // Replace with dynamic data
  const studentNames = ["Student 1", "Student 2", "Student 3"]; // Replace with dynamic data

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Certificate of Endorsement</h1>

      {/* PDF Viewer (Optional, for preview) */}
      <div className="w-full max-w-4xl h-[500px] border-2 border-gray-300 rounded-lg shadow-lg mb-4 flex flex-col">
        {PDFViewer && (
          <PDFViewer width="100%" height="100%">
            <CertificateOfEndorsement date={currentDate} adviserName={adviserName} studentNames={studentNames} />
          </PDFViewer>
        )}
      </div>

      {/* Download PDF Button */}
      {PDFDownloadLink && (
        <PDFDownloadLink
          document={<CertificateOfEndorsement date={currentDate} adviserName={adviserName} studentNames={studentNames} />}
          fileName="Certificate_of_Endorsement.pdf"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default Page;
