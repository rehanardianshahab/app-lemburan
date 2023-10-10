import axios from 'axios'
import mode from '@/services/mode'

export default {
    async login(payload) {
        const {data} = await axios.post(mode.host()+'/auth/signin', payload)
        return data
    }
}