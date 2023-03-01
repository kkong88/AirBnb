import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getDetail } from '../../store/spot'

function DetailSpot(){
    const dispatch = useDispatch()
    const { id } = useParams()
    const spots = useSelector((state) => state?.spot)

    useEffect(() => {
        dispatch(getDetail(id))
    },[dispatch, id])
    //console.log(spots)
    const detail = spots?.spotDetail
    //console.log(detail)
    if(detail === undefined) return <div>loading</div>
    const images = spots?.spotDetail.SpotImages
    //console.log(images,"!!!!!!!!")

    return (
        <div>{images?.map(image => (
            <img src={image.url}></img>
        ))}
        <p>{detail.state}</p>
        <p>{detail.city}</p>
        <p>{detail.country}</p>
        <p>{detail.name}</p>
        <p>{detail.price}</p>
        <p>{detail.description}</p>
        <p>{detail.avgStarRating}</p>
        </div>
    )
}

export default DetailSpot
