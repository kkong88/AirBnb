import {useEffect} from 'react'
import { useSelector, useDispatch} from 'react-redux'
import { NavLink } from 'react-router-dom'
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
                <NavLink to={`/spot/${spot.id}`}>
                 <img src={spot.imageUrl} alt={spot.name} />
                 <p> {spot.state}</p>
                 <p> {spot.city} </p>
                 <p> {spot.price} </p>
                 <p> {spot.avgStarRating} </p>
                 </NavLink>
            </div>
        ))}
    </div>
    )
}


export default LandingPage
