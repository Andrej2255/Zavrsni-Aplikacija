<template>
  <div class="flex flex-center bg-grey-2" style="min-height: 100vh">
    <q-card style="width: 360px" class="q-pa-md">
      <q-card-section>
        <div class="text-h5 text-center">Gym Tracker</div>
        <div class="text-subtitle2 text-center text-grey">Prijava</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input v-model="email" label="Email" type="email" outlined required />
          <q-input v-model="password" label="Lozinka" type="password" outlined required />

          <q-banner v-if="errorMessage" class="bg-red-1 text-red-9" dense>{{ errorMessage }}</q-banner>

          <q-btn type="submit" color="primary" label="Prijava" class="full-width" :loading="loading" />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center">
        Nemaš račun?
        <router-link to="/register">Registriraj se</router-link>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/boot/axios'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function onSubmit() {
  loading.value = true
  errorMessage.value = ''
  try {
    const { data } = await api.post('/auth/login', { email: email.value, password: password.value })
    auth.setSession(data.token, data.user)
    router.push('/dashboard')
  } catch (err) {
    errorMessage.value = err.response?.data?.error || 'Prijava nije uspjela'
  } finally {
    loading.value = false
  }
}
</script>
