import jwt from 'jsonwebtoken';
export const protectedRoute=(req,res,next)=>{
    try {
        const {userToken}=req.body;
        const secret=process.env.SECRET;
        const {_id}=jwt.verify(userToken,secret);
        req.body.user=_id;
        next();
    } catch (err) {
        res.json({success:false,error:err.message});
    }
}