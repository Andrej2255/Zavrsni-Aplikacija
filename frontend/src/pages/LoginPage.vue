<template>
  <div class="auth">
    <div class="auth-art" :style="{ backgroundImage: `url(${hero})` }">
      <div class="auth-logo">🏋️ Gym Tracker</div>
      <div>
        <div class="auth-headline">Svaki ponovljeni set vodi te naprijed.</div>
        <div class="auth-sub">Bilježi treninge, sastavljaj planove i prati napredak kroz jedan jednostavan alat.</div>
      </div>
      <div></div>
    </div>

    <div class="auth-form">
      <div class="auth-form-inner">
        <h1>Dobrodošao natrag</h1>
        <p class="muted mt-sm">Prijavi se u svoj račun</p>

        <form @submit.prevent="onSubmit" class="mt-md">
          <div class="field">
            <label>Email</label>
            <input v-model="email" type="email" class="input" required />
          </div>
          <div class="field">
            <label>Lozinka</label>
            <input v-model="password" type="password" class="input" required />
          </div>

          <div v-if="errorMessage" class="form-error">{{ errorMessage }}</div>

          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
            {{ loading ? 'Prijava...' : 'Prijava' }}
          </button>
        </form>

        <div class="text-center mt-md muted">
          Nemaš račun?
          <router-link to="/register">Registriraj se</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api'
import { setSession } from '@/auth'
import hero from '@/assets/img/auth-hero.jpg'

const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function onSubmit() {
  loading.value = true
  errorMessage.value = ''
  try {
    const data = await api.post('/auth/login', { email: email.value, password: password.value })
    setSession(data.token, data.user)
    router.push('/dashboard')
  } catch (err) {
    errorMessage.value = err.message || 'Prijava nije uspjela'
  } finally {
    loading.value = false
  }
}
</script>
