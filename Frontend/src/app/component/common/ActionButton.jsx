import React from 'react'

const ActionButton = (prop) => {
    return (
        <button
            type="button"
            aria-label={prop.name}
            className="bg-black/30 backdrop-blur-md border border-black/20 flex p-3 items-center justify-center rounded-full text-amber-50 transition hover:bg-white hover:text-gray-800"
        >
         <i 
            className={prop.icon} aria-hidden="true"></i>
        </button>

    )
}

export default ActionButton
