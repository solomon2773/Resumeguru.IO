export default function Tooltip({ message, children, showTooltip }) {
  return (

    <div className="relative flex max-w-max flex-col items-center justify-center">
      {children}
      <div
        className={`absolute left-full top-0 ml-2 min-w-max -translate-x-8 -translate-y-12 transform rounded-lg px-0 py-0 text-xs font-medium transition-all duration-500 
          ${showTooltip ? 'scale-100 z-50' : 'scale-0'} `}
      >
        <div className="flex max-w-xs flex-col items-center shadow-lg relative">
          <div className="rounded bg-gray-800 p-2 text-center text-xs text-white">
            {message}
          </div>
          <div className="absolute left-2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-t-gray-800 border-l-transparent border-r-transparent"></div>
        </div>
      </div>
    </div>
  );
}
