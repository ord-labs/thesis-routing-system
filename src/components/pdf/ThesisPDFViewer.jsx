import { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';

const ThesisPDFViewer = () => {
  const [thesisList, setThesisList] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThesis = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'thesis'));
        const thesisData = [];
        
        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          const storage = getStorage();
          const pdfUrl = await getDownloadURL(ref(storage, data.pdfPath));
          
          thesisData.push({
            id: doc.id,
            title: data.title,
            author: data.author,
            pdfUrl: pdfUrl
          });
        }
        
        setThesisList(thesisData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching thesis: ", error);
        setLoading(false);
      }
    };

    fetchThesis();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading thesis documents...</div>;

  return (
    <div className="grid grid-cols-[300px_1fr] gap-5 h-screen p-5">
      <div className="overflow-y-auto border-r border-gray-200 pr-5">
        {thesisList.map((thesis) => (
          <div 
            key={thesis.id} 
            className="p-4 border border-gray-200 mb-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setSelectedPDF(thesis.pdfUrl)}
          >
            <h3 className="font-semibold text-lg">{thesis.title}</h3>
            <p className="text-gray-600 text-sm">By: {thesis.author}</p>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 rounded-lg">
        {selectedPDF && (
          <iframe
            src={`${selectedPDF}#toolbar=0`}
            className="w-full h-full border-none"
            title="Thesis PDF Viewer"
          />
        )}
      </div>
    </div>
  );
};

export default ThesisPDFViewer;
