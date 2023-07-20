import { AiOutlineLoading3Quarters } from "react-icons/ai"

type LoadingSpinnerProps = {
    big?: boolean
}

export default function LoadingSpinner({big = false}: LoadingSpinnerProps) {
  
    const sizeClasses = big ? "w-16 h-16" : "w-10 h-10"
  
    return (
    <div className="flex justify-center p-2">
        <AiOutlineLoading3Quarters className={`animate-spin text-blue-500 ${sizeClasses}`} />
    </div>
  )
}
