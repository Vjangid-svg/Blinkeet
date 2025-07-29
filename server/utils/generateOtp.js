const generateOtp =()=>{
    return Math.floor(Math.random()*900000)+10000
}
export default generateOtp