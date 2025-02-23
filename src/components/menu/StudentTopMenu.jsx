import { FileUp } from "lucide-react";

const StudentTopMenu = () => {
  return (
    <div className="w-full h-16 rounded-2xl bg-gray-700 flex text-white items-center px-5">
      <ul className="[&>li]:flex [&>li]:cursor-pointer [&>li]:p-2 [&>li]:rounded-lg flex gap-3">
        <li className="hover:bg-gray-600">Submit Files <FileUp className="ml-2" size={25} /></li>
        <li className="hover:bg-gray-600">Panel</li>
        <li className="hover:bg-gray-600">Adviser</li>
      </ul>
    </div>
  );
};

export default StudentTopMenu;
