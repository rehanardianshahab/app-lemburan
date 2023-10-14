<template>
    <div class="w-full h-screen flex items-center justify-center bg-blue-200">
        <div class="w-3/4 flex <lg:flex-col lg:space-x-4 <lg:space-y-4">
            <el-card class="w-3/4 <lg:w-full rounded-lg">
                <div class="flex <lg:flex-col lg:space-x-4 <lg:space-y-4">
                    <el-card @click="handleRedirect(menu.route)" class="cursor-pointer" shadow="hover"
                        v-for="menu, index in menus" :key="'menu' + index">
                        <div class="text-center w-full flex justify-center">
                            <Document class="w-10 mb-3" />
                        </div>
                        <div class="text-center w-full">
                            {{ menu.label }}
                        </div>
                    </el-card>
                </div>
            </el-card>
            <el-card class="w-1/4 <lg:w-full rounded-lg flex items-center">
                <div>
                    <h2 class="semibold text-gray-500 font-semibold">Total Uang Lembur</h2>
                    <p class="text-green-500 text-3xl font-bold mt-2">Rp. {{ totalUang.toLocaleString("id-ID") }}</p>
                    <p class="text-gray-500 font-bold mt-2">Bulan {{ dayjs().format('MMMM') }}</p>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import dayjs from 'dayjs'
import service from '@/services/lemburan'
import serviceAuth from '@/services/auth'
import auth from '@/utils/auth'

import { ref, reactive, onMounted, computed } from 'vue'
import { Document } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useRequest } from 'vue-request'

const router = useRouter()
const menus = ref([
    {
        label: 'Lemburan',
        route: '/lembur'
    },
    {
        label: 'Report Bulanan',
        route: '/data-lembur'
    },
    {
        label: 'Report Tahunan',
        route: '/data-lembur'
    },
])

const handleRedirect = (value) => {
    router.push(value)
}

const workCounter = (scope) => {
    const mulaiTb = `${dayjs(scope.tanggal).format('YYYY-MM-DD')} ${scope.jam_mulai}`
    const minusDateTb = `${dayjs(scope.tanggal).add(1, 'd').format('YYYY-MM-DD')} ${scope.jam_selesai}`
    let selesaiTb = null
    const tempSelesaiTb = `${dayjs(scope.tanggal).format('YYYY-MM-DD')} ${scope.jam_selesai}`
    if (dayjs(tempSelesaiTb).diff(dayjs(mulaiTb), 'h', true) < 0) {
        selesaiTb = minusDateTb
    } else {
        selesaiTb = tempSelesaiTb
    }
    const resultTb = dayjs(selesaiTb).diff(dayjs(mulaiTb), 'h', true)
    return resultTb
}

const totalUang = ref(0)
const { data: tableData, loading: loadingFetch, run: fetchData } = useRequest(service.getData, {
    manual: true,
    onSuccess: (res) => {
        res.filter(data => dayjs(data.tanggal).format('YYYY-MM') == dayjs().format('YYYY-MM'))
            .find(data => {
                totalUang.value += workCounter(data) < 5 ? workCounter(data) : 5
            })
        totalUang.value = totalUang.value * 20000
    },
    onError: (e) => {
        if (e.response.data.message == 'No token provided!') {
            router.push('/')
            ElMessage({
                type: 'error',
                message: 'Session Ended'
            })
        }
    }
})

const { data: dataAuth, loading: loadingAuth, run: runAuth } = useRequest(serviceAuth.login, {
    manual: true,
})


onMounted(async () => {
    await fetchData(auth.getCookies('token'))
})
</script>