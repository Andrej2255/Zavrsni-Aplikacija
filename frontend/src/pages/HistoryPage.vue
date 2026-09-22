<template>
  <div>
    <PageHeader eyebrow="Evidencija" title="Povijest treninga" :subtitle="`${sessions.length} odrađenih treninga`">
      <template #actions>
        <button class="btn btn-primary" @click="showCreate = true">+ Novi trening</button>
      </template>
    </PageHeader>

    <div class="card">
      <router-link
        v-for="s in sessions"
        :key="s.id"
        :to="`/sessions/${s.id}`"
        class="card-list-item"
      >
        <div class="grow">
          <div class="title">{{ s.plan?.name || 'Slobodan trening' }}</div>
          <div class="caption">{{ formatDate(s.date) }} · {{ s.exercises.length }} vježbi</div>
        </div>
        <div>›</div>
      </router-link>

      <EmptyState
        v-if="sessions.length === 0"
        title="Još nema odrađenih treninga"
        caption="Započni trening — po izboru na temelju plana treninga."
      >
        <template #action>
          <button class="btn btn-primary" @click="showCreate = true">+ Novi trening</button>
        </template>
      </EmptyState>
    </div>

    <Modal v-model="showCreate">
      <div class="modal-header">Novi trening</div>
      <div class="modal-body">
        <form @submit.prevent="createSession">
          <div class="field">
            <label>Plan treninga (opcionalno)</label>
            <select v-model="form.planId" class="input">
              <option :value="null">Slobodan trening</option>
              <option v-for="p in planOptions" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>
          <div class="field">
            <label>Datum</label>
            <input v-model="form.date" type="date" class="input" required />
          </div>
          <button type="submit" class="btn btn-primary btn-block">Započni trening</button>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api'
import { formatDate, todayIso } from '@/utils/format'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import Modal from '@/components/Modal.vue'

const router = useRouter()
const sessions = ref([])
const planOptions = ref([])
const showCreate = ref(false)
const form = ref({ planId: null, date: todayIso() })

async function load() {
  const sessionsRes = await api.get('/sessions')
  sessions.value = sessionsRes.sessions

  const plansRes = await api.get('/plans')
  planOptions.value = plansRes.plans
}

async function createSession() {
  const data = await api.post('/sessions', form.value)
  showCreate.value = false
  router.push(`/sessions/${data.session.id}`)
}

onMounted(load)
</script>
