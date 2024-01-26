class TokenBucketRateLimiter{

    private max_tokens=5
    //This is per 10 seconds
    private refil_rate_pm=2
    private TokenBuckets: Record<string, number>={}
    
    allowRequestToPass(user_id: string): boolean{
        //No Request with That Particular User Was received
        if(typeof this.TokenBuckets[user_id]!=='number'){
            this.TokenBuckets[user_id]=this.max_tokens
            return true
        }
        if(this.TokenBuckets[user_id]===0){
            return false
        }
        this.TokenBuckets[user_id]--
        return true
    }

    refillBuckets(){
        for (const key in this.TokenBuckets) {
            this.TokenBuckets[key]=Math.min(this.refil_rate_pm + this.TokenBuckets[key], this.max_tokens) 
        }
    }

    getTokenBuckets(){
        return this.TokenBuckets
    }
}

/**
 * Every Minute This will run to reset bucket, note this should not exceed more than a ms if refil_rate is in minutes. 
 * Else stuff will go wrong
 */

export const CommentRateLimiter=new TokenBucketRateLimiter()

setInterval(()=>{
    console.log(`Refilling The buckets`)
    //Time Complexity O(n)
    CommentRateLimiter.refillBuckets()
    console.log(`Token Bockets now are`, CommentRateLimiter.getTokenBuckets())
}, 10000)