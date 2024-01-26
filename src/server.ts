import express, {Request, Response, NextFunction} from 'express'
import { CommentRateLimiter } from './RateLimiters/TokenBucket'
const app=express()
const PORT=5000

app.use(express.json({limit: '3mb'}))


type Comment={
    user_id: string,
    text: string
}
const comments: Comment[]=[]
//TODO: Make this a little more reusable with different rate limiters
const rateLimitingMiddleware=(req: Request, res: Response, next: NextFunction)=>{
    try{
        const user_id=req.headers.user_id as string | undefined
        if(!user_id){
            throw new Error(`User ID is required for all our requests`)
        }
        const allowed=CommentRateLimiter.allowRequestToPass(user_id)
        if(!allowed){
            return res.status(429).send('Hold yopur horses cowboy')
        }
        next()
    }catch(err){
        return res.status(500).send('Server Error: Are you passing user_id in headers???')
    }
}


app.post('/comment',[rateLimitingMiddleware] ,async(req: Request, res: Response)=>{
    console.log(`Received request from ${req.headers.user_id}`)
    comments.push({
        user_id: req.headers.user_id as string,
        text: req.body.text
    })
    return res.status(200).send('ok')
})



app.listen(PORT, ()=>{
    console.log(`Server Started at port ${PORT}`)
})