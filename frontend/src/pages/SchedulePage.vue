<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h5 col">Raspored treninga</div>
      <q-btn color="primary" icon="add" label="Planiraj trening" @click="showCreate = true" />
    </div>

    <q-list bordered separator>
      <q-item v-for="item in scheduledWorkouts" :key="item.id">
        <q-item-section>
          <q-item-label>{{ item.plan?.name || 'Slobodan trening' }}</q-item-label>
          <q-item-label caption>{{ formatDate(item.scheduledDate) }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-badge :color="statusColor(item.status)">{{ statusLabel(item.status) }}</q-badge>
        </q-item-section>
        <q-item-section side v-if="item.status === 'planned'">
          <div class="row q-gutter-xs">
            <q-btn flat round dense icon="check" color="positive" @click="setStatus(item, 'completed')" />
            <q-btn flat round dense icon="close" color="grey" @click="setStatus(item, 'skipped')" />
            <q-btn flat round dense icon="delete" color="negative" @click="removeItem(item.id)" />
          </div>
        </q-item-section>
      </q-item>
      <q-item v-if="scheduledWorkouts.length === 0">
        <q-item-section class="text-grey">Nema planiranih treninga.</q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="showCreate">
      <q-card style="width: 400px">
        <q-card-section class="text-h6">Planiraj trening</q-card-section>
        <q-card-section>
          <q-form @submit="createItem" class="q-gutter-md">
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
            <q-input v-model="form.scheduledDate" label="Datum" type="date" outlined required />
            <q-btn type="submit" color="primary" label="Spremi" class="full-width" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/boot/axios'
import { date as qdate } from 'quasar'

const scheduledWorkouts = ref([])
const planOptions = ref([])
const showCreate = ref(false)
const form = ref({ planId: null, scheduledDate: '' })

function formatDate(d) {
  return qdate.formatDate(d, 'DD.MM.YYYY.')
}

function statusLabel(status) {
  return { planned: 'Planirano', completed: 'Odrađeno', skipped: 'Preskočeno' }[status] || status
}

function statusColor(status) {
  return { planned: 'primary', completed: 'positive', skipped: 'grey' }[status] || 'grey'
}

async function load() {
  const [scheduleRes, plansRes] = await Promise.all([api.get('/schedule'), api.get('/plans')])
  scheduledWorkouts.value = scheduleRes.data.scheduledWorkouts
  planOptions.value = plansRes.data.plans
}

async function createItem() {
  await api.post('/schedule', form.value)
  showCreate.value = false
  form.value = { planId: null, scheduledDate: '' }
  await load()
}

async function setStatus(item, status) {
  await api.put(`/schedule/${item.id}`, { status })
  await load()
}

async function removeItem(id) {
  await api.delete(`/schedule/${id}`)
  await load()
}

onMounted(load)
</script>
