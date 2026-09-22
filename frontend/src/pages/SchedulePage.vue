<template>
  <div>
    <PageHeader eyebrow="Planiranje" title="Raspored treninga" subtitle="Zakaži treninge unaprijed i označi ih kad su odrađeni">
      <template #actions>
        <button class="btn btn-primary" @click="showCreate = true">+ Planiraj trening</button>
      </template>
    </PageHeader>

    <div class="card">
      <div v-for="item in scheduledWorkouts" :key="item.id" class="card-list-item">
        <div class="grow">
          <div class="title">{{ item.plan?.name || 'Slobodan trening' }}</div>
          <div class="caption">{{ formatDate(item.scheduledDate) }}</div>
        </div>
        <span class="badge" :class="statusBadgeClass(item.status)">{{ statusLabel(item.status) }}</span>
        <div v-if="item.status === 'planned'" style="display:flex; gap:6px; margin-left:10px">
          <button class="btn btn-sm" title="Odrađeno" @click="setStatus(item, 'completed')">✓</button>
          <button class="btn btn-sm btn-ghost" title="Preskoči" @click="setStatus(item, 'skipped')">✕</button>
          <button class="btn btn-sm btn-ghost" title="Obriši" @click="removeItem(item.id)">🗑</button>
        </div>
      </div>

      <EmptyState
        v-if="scheduledWorkouts.length === 0"
        title="Nema planiranih treninga"
        caption="Isplaniraj trening — po izboru poveži ga s planom treninga."
      >
        <template #action>
          <button class="btn btn-primary" @click="showCreate = true">+ Planiraj trening</button>
        </template>
      </EmptyState>
    </div>

    <Modal v-model="showCreate">
      <div class="modal-header">Planiraj trening</div>
      <div class="modal-body">
        <form @submit.prevent="createItem">
          <div class="field">
            <label>Plan treninga (opcionalno)</label>
            <select v-model="form.planId" class="input">
              <option :value="null">Slobodan trening</option>
              <option v-for="p in planOptions" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>
          <div class="field">
            <label>Datum</label>
            <input v-model="form.scheduledDate" type="date" class="input" required />
          </div>
          <button type="submit" class="btn btn-primary btn-block">Spremi</button>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api'
import { formatDate } from '@/utils/format'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import Modal from '@/components/Modal.vue'

const scheduledWorkouts = ref([])
const planOptions = ref([])
const showCreate = ref(false)
const form = ref({ planId: null, scheduledDate: '' })

function statusLabel(status) {
  return { planned: 'Planirano', completed: 'Odrađeno', skipped: 'Preskočeno' }[status] || status
}

function statusBadgeClass(status) {
  return { planned: 'badge-primary', completed: 'badge-success' }[status] || ''
}

async function load() {
  const scheduleRes = await api.get('/schedule')
  scheduledWorkouts.value = scheduleRes.scheduledWorkouts

  const plansRes = await api.get('/plans')
  planOptions.value = plansRes.plans
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
