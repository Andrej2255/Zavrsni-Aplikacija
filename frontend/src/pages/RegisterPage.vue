<template>
  <div class="auth">
    <div class="auth-art" :style="{ backgroundImage: `url(${hero})` }">
      <div class="auth-logo">🏋️ Gym Tracker</div>
      <div>
        <div class="auth-headline">Počni pratiti svaki trening.</div>
        <div class="auth-sub">Napravi besplatan račun i za manje od minute kreni s prvim planom treninga.</div>
        <ul class="auth-perks">
          <li>✓ Osobni katalog vježbi</li>
          <li>✓ Planovi i raspored treninga</li>
          <li>✓ Napredak i ciljevi</li>
        </ul>
      </div>
      <div></div>
    </div>

    <div class="auth-form">
      <div class="auth-form-inner">
        <h1>Kreiraj račun</h1>
        <p class="muted mt-sm">Besplatno, bez kreditne kartice</p>

        <form @submit.prevent="onSubmit" class="mt-md">
          <div class="field">
            <label>Ime i prezime</label>
            <input v-model="name" type="text" class="input" required />
          </div>
          <div class="field">
            <label>Email</label>
            <input v-model="email" type="email" class="input" required />
          </div>
          <div class="field">
            <label>Lozinka</label>
            <input v-model="password" type="password" class="input" required minlength="6" />
            <div class="muted" style="font-size:0.78rem; margin-top:4px">Minimalno 6 znakova</div>
          </div>

          <div v-if="errorMessage" class="form-error">{{ errorMessage }}</div>

          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
            {{ loading ? 'Registracija...' : 'Registracija' }}
          </button>
        </form>

        <div class="text-center mt-md muted">
          Već imaš račun?
          <router-link to="/login">Prijavi se</router-link>
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

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function onSubmit() {
  loading.value = true
  errorMessage.value = ''
  try {
    const data = await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value,
    })
    setSession(data.token, data.user)
    router.push('/dashboard')
  } catch (err) {
    errorMessage.value = err.message || 'Registracija nije uspjela'
  } finally {
    loading.value = false
  }
}
</script>
