<template>
  <div class="flex items-center justify-center w-full bg-gray-900 h-screen">
    <el-row class="w-full px-40">
      <el-col :span="6" class="w-full bg-white p-10 rounded-lg mr-10">
        <el-form ref="formRef" :model="formState" :rules="formRules" label-position="top" status-icon>
          <el-form-item label="Tanggal" prop="tanggal" class="w-full">
            <el-date-picker style="width: 100%" v-model="formState.tanggal" value-format="YYYY-MM-DD"
              format="DD/MM/YYYY" />
          </el-form-item>
          <el-form-item label="Waktu Mulai" prop="waktu_mulai" class="w-full">
            <el-time-select style="width: 100%" v-model="formState.waktu_mulai" start="00:00" step="00:30" end="23:30"
              placeholder="Masukkan Waktu Mulai" />
          </el-form-item>
          <el-form-item label="Waktu Selesai" prop="waktu_selesai" class="w-full">
            <el-time-select style="width: 100%" v-model="formState.waktu_selesai" start="00:00" step="00:30" end="23:30"
              placeholder="Masukkan Waktu Selesai" />
          </el-form-item>
          <el-form-item label="Waktu Kerja">
            {{ handleWorkCount() }}
          </el-form-item>
          <el-form-item label="Tentang" prop="tentang" class="w-full">
            <el-input :rows="3" type="textarea" class="w-full" v-model="formState.tentang" />
          </el-form-item>
          <el-form-item label="Alasan" prop="alasan" class="w-full">
            <el-input :rows="3" type="textarea" class="w-full" v-model="formState.alasan" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Document" type="primary" @click="handleSubmit">Simpan</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="17" class=" bg-white p-10 rounded-lg">
        <el-button @click="handleLogout">Logout</el-button>
        <el-button @click="handleRedirect">Back to Dashboard</el-button>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="tentang" label="Tentang" min-width="300px" show-overflow-tooltip />
          <el-table-column prop="tanggal" label="Tanggal" min-width="100px">
            <template #default="scope">
              {{ dayjs(scope.row.tanggal).format('DD/MM/YYYY') }}
            </template>
          </el-table-column>
          <el-table-column prop="jam_mulai" label="Waktu Mulai" min-width="150px" align="center">
            <template #default="scope">
              {{ dayjs('2023-01-01 ' + scope.row.jam_mulai).format('HH:mm') }}
            </template>
          </el-table-column>
          <el-table-column prop="jam_selesai" label="Waktu Selesai" min-width="150px" align="center">
            <template #default="scope">
              {{ dayjs('2023-01-01 ' + scope.row.jam_selesai).format('HH:mm') }}
            </template>
          </el-table-column>
          <el-table-column label="Jumlah Waktu" min-width="150px" align="center">
            <template #default="scope">
              {{ workCounter(scope.row) }} Jam
            </template>
          </el-table-column>
          <el-table-column label="Uang Lembur" min-width="150px" align="center">
            <template #default="scope">
              Rp. {{ (workCounter(scope.row) <= 5 ? workCounter(scope.row) * 20000 : 5 * 20000).toLocaleString("id-ID") }}
                </template>
          </el-table-column>
          <el-table-column prop="alasan" label="Alasan" min-width="300px" show-overflow-tooltip />
        </el-table>
        <div class="flex justify-center mt-3">
          <el-pagination small background layout="prev, pager, next" :total="50" class="mt-4" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import service from '@/services/lemburan'
import serviceAuth from '@/services/auth'
import auth from '@/utils/auth'

import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useRequest } from 'vue-request'

import {
  Document
} from '@element-plus/icons-vue'
import { ref, reactive, onMounted, computed } from 'vue'

const router = useRouter()
const formRef = ref()
const formRules = reactive({
  tanggal: [{ required: true }],
  waktu_mulai: [{ required: true }],
  waktu_selesai: [{ required: true }],
  tentang: [{ required: true }],
  alasan: [{ required: true }],
})

const formState = ref({
  tanggal: dayjs().format('YYYY-MM-DD'),
  waktu_mulai: '00:00',
  waktu_selesai: '01:00',
  tentang: '',
  alasan: ''
})

const handleWorkCount = () => {
  const mulai = `${formState.value.tanggal}
                        ${formState.value.waktu_mulai}`
  const minusDate = `${dayjs(formState.value.tanggal).add(1, 'd').format('YYYY-MM-DD')} ${formState.value.waktu_selesai}`
  const tempSelesai = `${formState.value.tanggal} ${formState.value.waktu_selesai}`
  let selesai = null
  if (dayjs(tempSelesai).diff(dayjs(mulai), 'h', true) < 0) {
    selesai = minusDate
  } else {
    selesai = tempSelesai
  }
  const result = dayjs(selesai).diff(dayjs(mulai), 'h', true)
  return result + ' Jam' + (result > 5 ? ' (Maksimal 5 Jam)' : '')
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

const { data: tableData, loading: loadingFetch, run: fetchData } = useRequest(service.getData, {
  manual: true,
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

const { data, loading, run } = useRequest(service.saveData, {
  manual: true,
  onSuccess: async () => {
    ElMessage({
      message: 'Data Lemburan Berhasil Dibuat',
      type: 'success'
    })
    formState.value = {
      tanggal: dayjs().format('YYYY-MM-DD'),
      waktu_mulai: '00:00',
      waktu_selesai: '01:00',
      tentang: '',
      alasan: ''
    }
    await fetchData(auth.getCookies('token'))
  },
  onError: (e) => {
    ElMessage({
      message: 'Data Lemburan Gagal Dibuat',
      type: 'error'
    })
  }
})

const { data: dataAuth, loading: loadingAuth, run: runAuth } = useRequest(serviceAuth.login, {
  manual: true,
})

const handleLogout = () => {
  router.push('/')
  return auth.deleteCookies()
}

const handleSubmit = async () => {
  await formRef.value.validate(async (valid) => {
    if (valid) {
      await run(auth.getCookies('token'), {
        user_id: auth.getCookies('id'),
        tanggal: formState.value.tanggal,
        jam_mulai: formState.value.waktu_mulai,
        jam_selesai: formState.value.waktu_selesai,
        tentang: formState.value.tentang,
        alasan: formState.value.alasan
      })
    } else {
      ElMessage({
        message: 'Silahkan Isi Form dengan benar',
        type: 'warning'
      })
    }
  })
  // tableData.value.push({
  //   tanggal: formState.value.tanggal,
  //   waktu_mulai: formState.value.waktu_mulai,
  //   waktu_selesai: formState.value.waktu_selesai,
  //   tentang: formState.value.tentang,
  //   alasan: formState.value.alasan
  // })
}

onMounted(async () => {
  await fetchData(auth.getCookies('token'))
})

const handleRedirect = () => {
  router.push('/dashboard')
}
</script>
