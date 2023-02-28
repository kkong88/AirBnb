import {useEffect} from 'react'
import { useSelector, useDispatch} from 'react-redux'
import { getSpot } from '../../store/spot'


function LandingPage(){
    const dispatch = useDispatch()
    const spots = useSelector((state) => state?.spot)

    useEffect(() => {
        dispatch(getSpot())
    },[dispatch])

    const previewImage = spots?.Spot
    
    return (
    <div>
        {previewImage?.map(spot => (
             <div key={spot.id}>
                 <img src={spot.imageUrl} alt={spot.name} />
            </div>
        ))}

    </div>
    )
}


export default LandingPage
