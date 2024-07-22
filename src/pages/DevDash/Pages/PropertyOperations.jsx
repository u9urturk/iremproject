import colorsIcon from "../../..//materials/renkler.svg"
import fabricsIcon from "../../..//materials/kumaslar.svg"
import patternsIcon from "../../..//materials/desenler.png"
import { Link } from 'react-router-dom'



export default function PropertyOperations() {




    

    return (
        <div className='flex animate-fade-down animate-ease-in-out animate-normal animate-fill-forwards w-full h-full flex-col items-center justify-center'>
            <div  className='flex flex-col w-full h-1/4 gap-y-8 items-center justify-center'>
                <h1 className='text-2xl font-semibold'>
                    Özellikler
                </h1>
            </div>

            <div className='grid gap-x-8  items-center place-items-center w-full h-3/4 grid-cols-2  '>
                <Link to={"renkler"}   className='bg-base-100 relative active:scale-95 group h-32 w-64 rounded-2xl B  cursor-pointer transition-all flex items-center justify-center text-3xl font-semibold  '>
                    <div className='group-hover:opacity-0 duration-500'>RENKLER</div>
                    <div className='absolute top-0 left-0 w-full h-full  items-center justify-center transition-all flex opacity-0 group-hover:opacity-100'>
                        <img className='image-full object-cover h-64 w-64' src={colorsIcon} alt="" />
                    </div>
                </Link>
                <Link to={"kumaslar"} className='bg-base-100 relative active:scale-95 group h-32 w-64 rounded-2xl B  cursor-pointer transition-all flex items-center justify-center text-3xl font-semibold  '>
                    <div className='group-hover:opacity-0  duration-500'> KUMAŞLAR </div>
                    <div className='absolute top-0 left-0 w-full h-full items-center justify-center transition-all flex opacity-0 group-hover:opacity-100'>
                        <img className='image-full object-cover h-64 w-64' src={fabricsIcon} alt="" />
                    </div>
                </Link>
                <Link to={"desenler"} className='bg-base-100 relative active:scale-95 group h-32 w-64 rounded-2xl B  cursor-pointer transition-all flex items-center justify-center text-3xl font-semibold  '>
                    <div className='group-hover:opacity-0  duration-500'>DESENLER</div>
                    <div className='absolute top-0 left-0 w-full h-full items-center justify-center transition-all flex opacity-0 group-hover:opacity-100'>
                        <img className='image-full object-cover h-64 w-64' src={patternsIcon} alt="" />
                    </div>
                </Link>
            </div>

        </div>
    )
} 
