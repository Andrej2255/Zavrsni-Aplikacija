<template>
  <div class="gt-auth">
    <div class="gt-auth__art" :style="{ backgroundImage: `url(${hero})` }">
      <div class="row items-center" style="gap:10px">
        <div class="gt-auth__logo"><q-icon name="fitness_center" size="20px" /></div>
        <div class="text-h6 text-weight-bold">Gym Tracker</div>
      </div>
      <div>
        <div class="text-h3 text-weight-bold" style="letter-spacing:-.02em; line-height:1.1">
          Svaki ponovljeni set<br>vodi te naprijed.
        </div>
        <div class="q-mt-md" style="max-width:420px; opacity:.9">
          Bilježi treninge, sastavljaj planove i prati napredak kroz grafove — sve na jednom mjestu.
        </div>
        <div class="row q-mt-lg" style="gap:26px">
          <div><div class="text-h5 text-weight-bold">20+</div><div class="text-caption" style="opacity:.85">vježbi u katalogu</div></div>
          <div><div class="text-h5 text-weight-bold">7</div><div class="text-caption" style="opacity:.85">modula za praćenje</div></div>
        </div>
      </div>
    </div>

    <div class="gt-auth__form">
      <div class="gt-auth__form-inner">
        <div class="text-h5 text-weight-bold">Dobrodošao natrag</div>
        <div class="gt-muted q-mb-lg">Prijavi se u svoj račun</div>

        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input v-model="email" label="Email" type="email" outlined required
            :rules="[v => !!v || 'Obavezno polje']">
            <template #prepend><q-icon name="mail" /></template>
          </q-input>
          <q-input v-model="password" label="Lozinka" :type="showPw ? 'text' : 'password'" outlined required
            :rules="[v => !!v || 'Obavezno polje']">
            <template #prepend><q-icon name="lock" /></template>
            <template #append>
              <q-icon :name="showPw ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPw = !showPw" />
            </template>
          </q-input>

          <q-banner v-if="errorMessage" class="bg-red-1 text-red-9 rounded-borders" dense>
            <template #avatar><q-icon name="error" color="negative" /></template>
            {{ errorMessage }}
          </q-banner>

          <q-btn type="submit" color="primary" label="Prijava" size="md" class="full-width" :loading="loading" />
        </q-form>

        <div class="text-center q-mt-lg gt-muted">
          Nemaš račun?
          <router-link to="/register" class="text-weight-bold">Registriraj se</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/boot/axios'
import { useAuthStore } from '@/stores/auth'
import hero from '@/assets/img/auth-hero.jpg'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const showPw = ref(false)
const loading = ref(false)
const errorMessage = ref('')

async function onSubmit () {
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

<style scoped>
.gt-auth__logo {
  width: 34px; height: 34px; border-radius: 10px;
  display: grid; place-items: center;
  background: rgba(255,255,255,.2);
}
</style>
