import {useEffect} from 'react'
import { useSelector, useDispatch} from 'react-redux'
import { getSpot } from '../../store/spot'


function LandingPage(){
    const dispatch = useDispatch()
    const spots = useSelector((state) => state.spot)

    useEffect(() => {
        dispatch(getSpot())
    },[dispatch])
    
    return (
        <div>
        </div>
    )
}


export default LandingPage
