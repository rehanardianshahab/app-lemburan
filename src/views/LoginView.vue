<template>
    <div class="w-full h-screen flex items-center justify-center">
        <el-card class="w-3/4">
            <h1 class="font-bold text-2xl my-6">Login</h1>
            <el-form label-position="top" :model="formState" :rules="formRules" ref="formRef">
                <el-form-item label="Username" prop="username">
                    <el-input v-model="formState.username" placeholder="Eg: myusername" />
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input type="password" v-model="formState.password" placeholder="Eg: **********" show-password />
                </el-form-item>
                <div class="flex justify-end mt-8">
                    <el-button type="primary" :loading="loadingAuth" @click="handleSubmit">Sign In</el-button>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import serviceAuth from '@/services/auth'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { useRequest } from 'vue-request'

const router = useRouter()
const formRef = ref()
const formRules = reactive({
    username: [{ required: true, trigger: ['blur'] }],
    password: [{ required: true, trigger: ['blur'] }],
})
const formState = ref({
    username: '',
    password: '',
})

const getCookie = document.cookie

const setCookie = (token, email, roles) => {
    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    document.cookie = "token=" + token
    document.cookie = "email=" + email
    document.cookie = "roles=" + roles[0]
    document.cookie = "expires=" + date.toUTCString()
}

const { data: dataAuth, loading: loadingAuth, run: runAuth } = useRequest(serviceAuth.login, {
    manual: true,
    onSuccess: (res) => {
        setCookie(res.accessToken, res.email, res.roles)
        ElMessage({
            type: 'success',
            message: 'Login successfully',
        })
        router.push('/dashboard')
    },
    onError: (e) => {
        ElMessage({
            type: 'error',
            message: 'Login failed' + e,
        })
    }
})

const handleSubmit = async () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            await runAuth({
                username: formState.value.username,
                password: formState.value.password,
            })
        } else {
            ElMessage({
                type: 'warning',
                message: 'Please enter your username and password'
            })
        }
    })
}
</script>