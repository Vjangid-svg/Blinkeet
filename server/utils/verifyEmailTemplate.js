const verifyEmailTemplate = ({name,url})=>{
    return `
    <p>Dear ${name}</p>
    <p>Thank you for regestring on Binkeyit.</p>
    <a href=${url} style=" background-color: #4CAF50; 
  color: white; 
  padding: 12px 24px; 
  font-size: 16px; 
  border: none; 
  border-radius: 8px; 
  cursor: pointer; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
  transition: background-color 0.3s ease;" >Verify Email </a>
     `
}
export default verifyEmailTemplate