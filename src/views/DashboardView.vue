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
                    <p class="text-green-500 text-3xl font-bold mt-2">Rp. 1.000.000</p>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Document } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

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
</script>