<template>
  <el-dialog v-model="dialogVisible" title="Generate Laporan" width="40%">
    <span>Apakah Anda yakin ingin Generate Perubahan Laporan ?</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button>Batal</el-button>
        <el-button type="primary">
          Lihat Data
        </el-button>
        <el-button type="primary">
          OK
        </el-button>
      </span>
    </template>
  </el-dialog>
  <div class="flex items-center justify-center w-full bg-gray-900 h-screen">
    <el-button @click="dialogVisible = true"></el-button>
    <el-row class="w-full px-40">
      <el-col :span="6" class="w-full bg-white p-10 rounded-lg mr-10">
        <el-form :model="formState" :rules="formRules" label-position="top" status-icon>
          <el-form-item label="Tanggal" prop="tanggal" class="w-full">
            <el-date-picker style="width: 100%" v-model="formState.tanggal" value-format="YYYY-MM-DD"
              format="DD/MM/YYYY" />
          </el-form-item>
          <el-form-item label="Waktu Mulai" prop="tanggal" class="w-full">
            <el-time-select style="width: 100%" v-model="formState.waktu_mulai" start="00:00" step="00:30" end="23:30"
              placeholder="Masukkan Waktu Mulai" />
          </el-form-item>
          <el-form-item label="Waktu Selesai" prop="tanggal" class="w-full">
            <el-time-select style="width: 100%" v-model="formState.waktu_selesai" start="00:00" step="00:30" end="23:30"
              placeholder="Masukkan Waktu Selesai" />
          </el-form-item>
          <el-form-item label="Waktu Kerja">
            {{ handleWorkCount() }}
          </el-form-item>
          <el-form-item label="Tentang" prop="tanggal" class="w-full">
            <el-input :rows="3" type="textarea" class="w-full" v-model="formState.tentang" />
          </el-form-item>
          <el-form-item label="Alasan" prop="tanggal" class="w-full">
            <el-input :rows="3" type="textarea" class="w-full" v-model="formState.alasan" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Document" type="primary" @click="handleSubmit">Simpan</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="17" class=" bg-white p-10 rounded-lg">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="tanggal" label="Tanggal" min-width="300px">
            <template #default="scope">
              {{ dayjs(scope.row.tanggal).format('DD/MM/YYYY') }}
            </template>
          </el-table-column>
          <el-table-column prop="jam_mulai" label="Waktu Mulai" min-width="300px" />
          <el-table-column prop="jam_selesai" label="Waktu Selesai" min-width="300px" />
          <el-table-column prop="tentang" label="Tentang" min-width="300px" />
          <el-table-column prop="alasan" label="Alasan" min-width="300px" />
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
import { useRequest } from 'vue-request'

import {
  Document
} from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'

// const tableData = ref([])

const dialogVisible = ref(false)
const formRules = reactive({

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

const { data: tableData, loading: loadingFetch, run: fetchData } = useRequest(service.getData, {
  manual: true,
})

const { data, loading, run } = useRequest(service.saveData, {
  manual: true,
  onSuccess: () => {
    // ElMessage({
    //   message: 'Berhasil Menambahkan',
    //   type: 'success'
    // })
  }
})

const { data: dataAuth, loading: loadingAuth, run: runAuth } = useRequest(serviceAuth.login, {
  manual: true,
})


const handleSubmit = () => {
  run(dataAuth.value.accessToken, {
    user_id: dataAuth.value.id,
    tanggal: formState.value.tanggal,
    jam_mulai: formState.value.waktu_mulai,
    jam_selesai: formState.value.waktu_selesai,
    tentang: formState.value.tentang,
    alasan: formState.value.alasan
  })
  // tableData.value.push({
  //   tanggal: formState.value.tanggal,
  //   waktu_mulai: formState.value.waktu_mulai,
  //   waktu_selesai: formState.value.waktu_selesai,
  //   tentang: formState.value.tentang,
  //   alasan: formState.value.alasan
  // })
}

// onMounted(async () => {
//   await runAuth({
//     username: 'admin',
//     password: 'admin',
//   })
//   setTimeout(async () => {
//     await fetchData(dataAuth.value.accessToken)
//   }, 1000);
// })
</script>
