<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h5 col">Povijest treninga</div>
      <q-btn color="primary" icon="add" label="Novi trening" @click="showCreate = true" />
    </div>

    <q-list bordered separator>
      <q-item v-for="s in sessions" :key="s.id" clickable :to="`/sessions/${s.id}`">
        <q-item-section>
          <q-item-label>{{ s.plan?.name || 'Slobodan trening' }}</q-item-label>
          <q-item-label caption>{{ formatDate(s.date) }} · {{ s.exercises.length }} vježbi</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="sessions.length === 0">
        <q-item-section class="text-grey">Još nema odrađenih treninga.</q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="showCreate">
      <q-card style="width: 400px">
        <q-card-section class="text-h6">Novi trening</q-card-section>
        <q-card-section>
          <q-form @submit="createSession" class="q-gutter-md">
            <q-select
              v-model="form.planId"
              :options="planOptions"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              label="Plan treninga (opcionalno)"
              outlined
              clearable
            />
            <q-input v-model="form.date" label="Datum" type="date" outlined required />
            <q-btn type="submit" color="primary" label="Započni trening" class="full-width" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/boot/axios'
import { date as qdate } from 'quasar'

const router = useRouter()
const sessions = ref([])
const planOptions = ref([])
const showCreate = ref(false)
const form = ref({ planId: null, date: qdate.formatDate(Date.now(), 'YYYY-MM-DD') })

function formatDate(d) {
  return qdate.formatDate(d, 'DD.MM.YYYY.')
}

async function load() {
  const [sessionsRes, plansRes] = await Promise.all([api.get('/sessions'), api.get('/plans')])
  sessions.value = sessionsRes.data.sessions
  planOptions.value = plansRes.data.plans
}

async function createSession() {
  const { data } = await api.post('/sessions', form.value)
  showCreate.value = false
  router.push(`/sessions/${data.session.id}`)
}

onMounted(load)
</script>
