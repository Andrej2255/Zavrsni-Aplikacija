<template>
  <div>
    <PageHeader eyebrow="Trening" title="Planovi treninga" :subtitle="`${plans.length} ${plans.length === 1 ? 'plan' : 'planova'}`">
      <template #actions>
        <button class="btn btn-primary" @click="showCreate = true">+ Novi plan</button>
      </template>
    </PageHeader>

    <div class="grid grid-3">
      <div v-for="plan in plans" :key="plan.id" class="card plan-card">
        <div class="card-body grow">
          <div class="title">{{ plan.name }}</div>
          <div class="caption mt-sm">{{ plan.description || 'Bez opisa' }}</div>
          <span class="badge badge-primary mt-sm" style="display:inline-block">{{ plan.exercises.length }} vježbi</span>
        </div>
        <div style="display:flex; border-top:1px solid var(--border)">
          <router-link :to="`/plans/${plan.id}`" class="btn btn-ghost btn-block" style="border:none; border-radius:0">Uredi</router-link>
          <button class="btn btn-ghost" style="border:none; border-radius:0" @click="confirmRemove(plan)">🗑</button>
        </div>
      </div>

      <div v-if="plans.length === 0" class="card" style="grid-column: 1 / -1">
        <EmptyState title="Još nemaš planova treninga" caption="Kreiraj plan pa mu dodaj vježbe s ciljanim serijama i kilažom.">
          <template #action>
            <button class="btn btn-primary" @click="showCreate = true">+ Novi plan</button>
          </template>
        </EmptyState>
      </div>
    </div>

    <Modal v-model="showCreate">
      <div class="modal-header">Novi plan treninga</div>
      <div class="modal-body">
        <form @submit.prevent="createPlan">
          <div class="field">
            <label>Naziv plana</label>
            <input v-model="form.name" type="text" class="input" required />
          </div>
          <div class="field">
            <label>Opis (opcionalno)</label>
            <textarea v-model="form.description" class="input" rows="3"></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Spremi</button>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import Modal from '@/components/Modal.vue'

const router = useRouter()
const plans = ref([])
const showCreate = ref(false)
const form = ref({ name: '', description: '' })

async function load() {
  const data = await api.get('/plans')
  plans.value = data.plans
}

async function createPlan() {
  const data = await api.post('/plans', form.value)
  showCreate.value = false
  form.value = { name: '', description: '' }
  router.push(`/plans/${data.plan.id}`)
}

async function confirmRemove(plan) {
  if (!confirm(`Sigurno želiš obrisati plan "${plan.name}"?`)) return
  await api.delete(`/plans/${plan.id}`)
  await load()
}

onMounted(load)
</script>

<style scoped>
.plan-card { display: flex; flex-direction: column; }
</style>
