<template>
  <q-page class="q-pa-md q-pa-lg-xl">
    <div class="gt-wrap" style="max-width: 820px">
      <PageHeader eyebrow="Planiranje" title="Raspored treninga"
        subtitle="Zakaži treninge unaprijed i označi ih kad su odrađeni">
        <template #actions>
          <q-btn color="primary" unelevated icon="add" label="Planiraj trening" @click="showCreate = true" />
        </template>
      </PageHeader>

      <q-card class="gt-accent gt-accent--blue">
        <q-list separator>
          <q-item v-for="item in scheduledWorkouts" :key="item.id">
            <q-item-section avatar>
              <q-avatar rounded :style="{ background: statusAvatar(item.status).bg, color: '#fff' }"
                :icon="statusIcon(item.status)" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ item.plan?.name || 'Slobodan trening' }}</q-item-label>
              <q-item-label caption>{{ formatDate(item.scheduledDate) }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge :color="statusColor(item.status)">{{ statusLabel(item.status) }}</q-badge>
            </q-item-section>
            <q-item-section side v-if="item.status === 'planned'">
              <div class="row q-gutter-xs">
                <q-btn round dense unelevated color="positive" icon="check" @click="setStatus(item, 'completed')" />
                <q-btn round dense flat color="grey-6" icon="close" @click="setStatus(item, 'skipped')" />
                <q-btn round dense flat color="grey-6" icon="delete" @click="removeItem(item.id)" />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-if="scheduledWorkouts.length === 0">
          <EmptyState icon="event_busy" title="Nema planiranih treninga"
            caption="Isplaniraj trening — po izboru poveži ga s planom treninga.">
            <template #action><q-btn color="primary" unelevated icon="add" label="Planiraj trening" @click="showCreate = true" /></template>
          </EmptyState>
        </div>
      </q-card>

      <q-dialog v-model="showCreate">
        <q-card style="width: 440px; max-width: 92vw">
          <q-card-section class="text-h6">Planiraj trening</q-card-section>
          <q-separator />
          <q-card-section>
            <q-form @submit="createItem" class="q-gutter-md">
              <q-select v-model="form.planId" :options="planOptions" option-value="id" option-label="name"
                emit-value map-options label="Plan treninga (opcionalno)" outlined clearable />
              <q-input v-model="form.scheduledDate" label="Datum" type="date" outlined required stack-label />
              <q-btn type="submit" color="primary" unelevated label="Spremi" class="full-width" />
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/boot/axios'
import { date as qdate } from 'quasar'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'

const scheduledWorkouts = ref([])
const planOptions = ref([])
const showCreate = ref(false)
const form = ref({ planId: null, scheduledDate: '' })

function formatDate (d) {
  return qdate.formatDate(d, 'DD.MM.YYYY.')
}

function statusLabel (status) {
  return { planned: 'Planirano', completed: 'Odrađeno', skipped: 'Preskočeno' }[status] || status
}

function statusColor (status) {
  return { planned: 'primary', completed: 'positive', skipped: 'grey' }[status] || 'grey'
}

function statusIcon (status) {
  return { planned: 'event', completed: 'check', skipped: 'block' }[status] || 'event'
}

function statusAvatar (status) {
  return {
    planned: { bg: 'linear-gradient(135deg,#6D4BFF,#A855F7)' },
    completed: { bg: 'linear-gradient(135deg,#12B981,#37D9A6)' },
    skipped: { bg: '#3a3550' },
  }[status] || { bg: '#3a3550' }
}

async function load () {
  const [scheduleRes, plansRes] = await Promise.all([api.get('/schedule'), api.get('/plans')])
  scheduledWorkouts.value = scheduleRes.data.scheduledWorkouts
  planOptions.value = plansRes.data.plans
}

async function createItem () {
  await api.post('/schedule', form.value)
  showCreate.value = false
  form.value = { planId: null, scheduledDate: '' }
  await load()
}

async function setStatus (item, status) {
  await api.put(`/schedule/${item.id}`, { status })
  await load()
}

async function removeItem (id) {
  await api.delete(`/schedule/${id}`)
  await load()
}

onMounted(load)
</script>
