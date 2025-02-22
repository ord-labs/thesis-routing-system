const TopMenu = ({ menuItems = [] }) => {
  return (
    <div className="w-full h-16 rounded-2xl bg-gray-700 flex text-white items-center px-5">
      <ul className="[&>li]:flex flex gap-3">
        {menuItems?.length > 0 && (
          menuItems.map((item, index) => (
            <li className="cursor-pointer hover:bg-gray-600 p-2 rounded-lg" key={index}>
              {item.label} {item.icon && <span className="ml-2">{item.icon}</span>}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TopMenu;
