interface DropdownItemProps{
    text: string
    isActive?: boolean
    onClick?: () => void
}

export default function DropdownItem({text, isActive=false, onClick}
    :DropdownItemProps){
        return(
            <button
                onClick={onClick}
                className={`w-full min-w-xs text-center px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-700/50 hover:text-white
                    ${isActive? " font-medium" : " text-gray-300 "}`}
                
            >
                {text}
            </button>
        )
}