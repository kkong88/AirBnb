import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { createSpot, getDetail } from '../../store/spot'




function CreateSpot() {
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [city, setCity] = useState('')
    const [address, setAddress] = useState('')
    const [description, setDesciption] = useState('')
    const [price, setPrice] = useState(1)
    const [previewImage, setPreviewImage] = useState('')
    const [image1, setImage1] = useState('')
    const [image2, setImage2] = useState('')
    const [image3, setImage3] = useState('')
    const [image4, setImage4] = useState('')
    const history = useHistory()

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
        const payload = { name, state, country, city, address, description, price, images:[previewImage,image1,image2,image3,image4] }
        const newSpot = await dispatch(createSpot(payload))
         if(newSpot){
            const spotId = newSpot.id
            payload.images.forEach( async(imageUrl, index) => {
                if(imageUrl.trim() !== "") await dispatch(createSpot(spotId,imageUrl,index))
            })
            await dispatch(getDetail(spotId))
           history.push(`/spot/${spotId}`)
         }
    }

    return (
        <>
        <h1>Create a New Spot</h1>
        <h2>Where's your place located</h2>
        <form onSubmit={handleSubmit}>
        <li>
        <label>country
            <input
            type="text"
            value={country}
            onChange={(e)=> setCountry(e.target.value)}
            />
        </label>
        </li>
        <li>
        <label>street address
            <input
            type='text'
            value={address}
            onChange={(e) =>setAddress(e.target.value)}
            />
        </label>
        </li>
        <li>
        <label>city
            <input
            type='text'
            value={city}
            onChange={(e) =>setCity(e.target.value)}
            />
        </label>
        </li>
        <li>
        <label>state
            <input
            type='text'
            value={state}
            onChange={(e) =>setState(e.target.value)}
            />
        </label>
        </li>
        <li>
        <label>description
            <input
            type='text'
            value={description}
            onChange={(e) =>setDesciption(e.target.value)}
            />
        </label>
        </li>
        <li>
        <label>name
            <input
            type='text'
            value={name}
            onChange={(e) =>setName(e.target.value)}
            />
        </label>
        </li>
        <li>
        <label>price
            <input
            type='number'
            value={price}
            onChange={(e) =>setPrice(e.target.value)}
            />
        </label>
        </li>
        <li>
        <label>image
            <input
            type='text'
            name='previewImage'
            onChange={handleImages}
            />
        </label>
        </li>
        <button type="submit">Create</button>
        </form>
        </>
    )
}

export default CreateSpot
