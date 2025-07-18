import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

const generateAuthToken = (userId: string) => {
  const authToken = jwt.sign({
    userId,
    type: 'AUTH_TOKEN'
  }, process.env.JWT_SECRET!,{
    expiresIn: '12hrs'
  })
   const refreshToken = jwt.sign({
    userId,
    type: 'REFRESH_TOKEN'
  }, process.env.JWT_SECRET!,{
    expiresIn: '7days'
  })
  return  {
    authToken,
    refreshToken
  }
}

export default  {
generateAuthToken
}