import axios from 'axios'
import mode from '@/services/mode'

export default {
    async getData(token){
        const {data} = await axios.get(mode.host()+'/lemburs/allLembur', {
            headers: {
                'x-access-token': token
            }
        })
        return data
    },
    async saveData(token,payload){
        const {data} = await axios.post(mode.host()+'/lemburs/addLembur', payload,{
            headers: {
                'x-access-token': token
            }
        })
        return data
    }
}