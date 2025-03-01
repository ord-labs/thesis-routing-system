"use client";

import React from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import CertificateOfEndorsement from "../../../../components/pdf/CertificateOfEndorsement";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Certificate of Endorsement</h1>

      {/* PDF Viewer (Optional, for preview) */}
      <div className="w-full max-w-4xl h-[500px] border-2 border-gray-300 rounded-lg shadow-lg mb-4">
        <PDFViewer width="100%" height="100%">
          <CertificateOfEndorsement />
        </PDFViewer>
      </div>

      {/* Download PDF Button */}
      <PDFDownloadLink
        document={<CertificateOfEndorsement />}
        fileName="Certificate_of_Endorsement.pdf"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
      >
        {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
      </PDFDownloadLink>
    </div>
  );
};

export default Page;
