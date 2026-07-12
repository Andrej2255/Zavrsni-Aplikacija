<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h5 col">Planovi treninga</div>
      <q-btn color="primary" icon="add" label="Novi plan" @click="showCreate = true" />
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-4" v-for="plan in plans" :key="plan.id">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ plan.name }}</div>
            <div class="text-caption text-grey">{{ plan.description }}</div>
            <div class="text-caption q-mt-sm">{{ plan.exercises.length }} vježbi</div>
          </q-card-section>
          <q-card-actions>
            <q-btn flat color="primary" label="Uredi" :to="`/plans/${plan.id}`" />
            <q-btn flat color="negative" label="Obriši" @click="removePlan(plan.id)" />
          </q-card-actions>
        </q-card>
      </div>
      <div v-if="plans.length === 0" class="col-12 text-grey">Još nemaš planova treninga.</div>
    </div>

    <q-dialog v-model="showCreate">
      <q-card style="width: 400px">
        <q-card-section class="text-h6">Novi plan treninga</q-card-section>
        <q-card-section>
          <q-form @submit="createPlan" class="q-gutter-md">
            <q-input v-model="form.name" label="Naziv plana" outlined required />
            <q-input v-model="form.description" label="Opis (opcionalno)" type="textarea" outlined />
            <q-btn type="submit" color="primary" label="Spremi" class="full-width" />
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

const router = useRouter()
const plans = ref([])
const showCreate = ref(false)
const form = ref({ name: '', description: '' })

async function load() {
  const { data } = await api.get('/plans')
  plans.value = data.plans
}

async function createPlan() {
  const { data } = await api.post('/plans', form.value)
  showCreate.value = false
  form.value = { name: '', description: '' }
  router.push(`/plans/${data.plan.id}`)
}

async function removePlan(id) {
  await api.delete(`/plans/${id}`)
  await load()
}

onMounted(load)
</script>
