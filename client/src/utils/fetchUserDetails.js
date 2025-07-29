import Axios from "./Axios"
import Summaryapi from "../common/Summaryapi"

const fetchUserDetails = async()=>{
    try {
        const response = await Axios({
            ...Summaryapi.userDetails
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export default fetchUserDetails