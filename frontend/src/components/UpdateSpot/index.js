import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { createSpot, getDetail } from '../../store/spot'
import { updateSpot } from '../../store/spot'



function UpdateSpot({spot}) {
    const dispatch = useDispatch()
    const [name, setName] = useState(spot.name)
    const [state, setState] = useState(spot.state)
    const [country, setCountry] = useState(spot.country)
    const [city, setCity] = useState(spot.city)
    const [address, setAddress] = useState(spot.address)
    const [description, setDesciption] = useState(spot.description)
    const [price, setPrice] = useState(spot.price)
    const [previewImage, setPreviewImage] = useState(spot.previewImage)
    const [image1, setImage1] = useState(spot.image1)
    const [image2, setImage2] = useState(spot.image2)
    const [image3, setImage3] = useState(spot.image3)
    const [image4, setImage4] = useState(spot.image3)
    const [errors, setErrors] = useState([])
    const history = useHistory()
    const { id } = useParams()

    const handleImages = (e) => {
        const {name, value} = e.target;
        switch(name){
            case 'previewImage':
                setPreviewImage(value)
                break;
            case 'image1':
                setImage1(value)
                break
            case 'image2':
                 setImage2(value)
                 break
            case 'image3':
                setImage3(value)
                break
            case 'image4':
                setImage4(value)
                break
            default:
                return
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors([])
        const validationError = []

        if(name.length > 50) validationError.push('Name must be less than 50 characters')
        if(!name.length) validationError.push('Name is Required')
        if(!price.length) validationError.push('Price is Required')
        if(!country.length) validationError.push('Country is Required')
        if(!city.length) validationError.push('City is Required')
        if(!state.length) validationError.push('State is Required')
        if(description.length <= 30) validationError.push('Description must be a minimum of 30 characters')
        if(!previewImage.length) validationError.push('Preview Image is required')

        setErrors(validationError)
        if(validationError.length) return

        const payload = { name, state, country, city, address, description, price, images:[previewImage,image1,image2,image3,image4] }
        const newSpot = await dispatch(updateSpot(spot.id,payload))
         if(newSpot){
            const spotId = newSpot.id
            // payload.images.forEach( async(imageUrl, index) => {
            //     if(imageUrl.trim() !== "") await dispatch(createSpot(spotId,imageUrl,index))
            // })
            await dispatch(getDetail(spotId))
           history.push(`/spot/${spotId}`)
         }
    }

    return (
        <>
        <h1>Create a New Spot</h1>
        <h2>Where's your place located</h2>
        <ul>
            {errors.length ? <h3>Errors</h3> : ""}
            <div className='errors'>
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </div>
        </ul>
        <form onSubmit={handleSubmit}>
        <li>
        <label>country
            <input
            type="text"
            value={country}
            placeholder="Required is required"
            onChange={(e)=> setCountry(e.target.value)}

            />
        </label>
        </li>
        <li>
        <label>street address
            <input
            type='text'
            value={address}
            placeholder="Address is Required"
            onChange={(e) =>setAddress(e.target.value)}

            />
        </label>
        </li>
        <li>
        <label>city
            <input
            type='text'
            value={city}
            placeholder="City is Required"
            onChange={(e) =>setCity(e.target.value)}

            />
        </label>
        </li>
        <li>
        <label>state
            <input
            type='text'
            value={state}
            placeholder="State is Required"
            onChange={(e) =>setState(e.target.value)}

            />
        </label>
        </li>
        <li>
        <label>description
            <input
            type='text'
            value={description}
            placeholder="Desciption"
            onChange={(e) =>setDesciption(e.target.value)}

            />
        </label>
        </li>
        <li>
        <label>name
            <input
            type='text'
            value={name}
            placeholder="Name is Required"
            onChange={(e) =>setName(e.target.value)}

            />
        </label>
        </li>
        <li>
        <label>price
            <input
            type='number'
            value={price}
            placeholder='Price is required'
            onChange={(e) =>setPrice(e.target.value)}

            />
        </label>
        </li>
        <li>
        <label>image
            <input
            type='text'
            name='previewImage'
            placeholder='Preview Image is Required'
            onChange={handleImages}

            />
        </label>
        </li>
        <button type="submit">Create</button>
        </form>
        </>
    )
}

export default UpdateSpot
