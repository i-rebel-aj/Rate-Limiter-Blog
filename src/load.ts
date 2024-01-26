/**
 * This File Will Simply Send Requests
 */
import axios from 'axios'

axios.post('http://localhost:5000/comment', {
    "text": "heyyy"
}, {
    headers: {
        'Content-Type': 'application/json', // Add necessary headers
        'user_id': "A"
    }
}).then((res)=>{
    console.log('Res is', res)
})