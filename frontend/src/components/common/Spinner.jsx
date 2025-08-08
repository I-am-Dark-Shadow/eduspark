const Spinner = ({ size = '8', color = 'primary' }) => {
  return (
    <div className={`w-${size} h-${size} border-4 border-gray-200 border-t-${color} rounded-full animate-spin`}></div>
  );
};

export default Spinner;