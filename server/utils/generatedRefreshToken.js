import jwt from 'jsonwebtoken'
import UserModel from '../models/users.model.js'

export const generatedRefreshToken = async(userId)=>{
    const token = await jwt.sign(
        {id:userId},
        process.env.SECRET_KEY_REFRESH_TOKEN,
        {expiresIn:'7d'}
    )
    const updateRefreshToken = await UserModel.updateOne({_id : userId},{refresh_token:token})
    return token;
}
export default generatedRefreshToken