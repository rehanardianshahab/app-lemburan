import {useRouter} from 'vue-router'

export default {
    auth(){
        const router = useRouter()
        const getCookie = document.cookie
        const date = new Date().toUTCString()
        if(getCookie.expires >=date) {
            router.push('/dashboard')
            return 
        }else{
            router.push('/')
            return 
        }
    }
}