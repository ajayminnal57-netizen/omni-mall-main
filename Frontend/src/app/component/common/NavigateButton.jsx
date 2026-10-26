import Link from 'next/link'

const NavigateButton = ({ text, href }) => {
    const className = "bg-red-100 text-gray-950 w-35 sm:w-50 py-3 rounded-3xl flex justify-center items-center text-base font-medium hover:translate-y-[-5px] duration-100";

    if (href) {
        return (
            <Link href={href} className={className}>
                {text}
                <i className="fa-solid fa-arrow-right-long px-2"></i>
            </Link>
        );
    }

    return (
        <button type="button" className={className}>
            {text}
            <i className="fa-solid fa-arrow-right-long px-2"></i>
        </button>
    )
}

export default NavigateButton
