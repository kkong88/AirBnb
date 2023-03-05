import {useEffect} from 'react'
import { useSelector, useDispatch} from 'react-redux'
import { NavLink } from 'react-router-dom'
import { getSpot } from '../../store/spot'
import "./LandingPage.css"



function LandingPage(){
    const dispatch = useDispatch()
    const spots = useSelector((state) => state?.spot)

    useEffect(() => {
        dispatch(getSpot())
    },[dispatch])

    const previewImage = spots?.Spot

    return (
    <div className='body'>
        {previewImage?.map(spot => (
             <div key={spot.id}>
                <NavLink to={`/spot/${spot.id}`}>
                 <img className="img" src={spot.previewImage} alt={spot.name} />
                 <span className='state'> {spot.city}, {spot.state}</span>
                 <span> ${spot.price} </span>
                 <span className='review'> {spot.avgStarRating}
                  <i className='fa-solid fa-star'/>
                 </span>
                 </NavLink>
            </div>
        ))}
    </div>
    )
}


export default LandingPage
