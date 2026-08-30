<template>
  <q-page class="q-pa-md q-pa-lg-xl">
    <div class="gt-wrap" style="max-width: 820px">
      <PageHeader eyebrow="Evidencija" title="Povijest treninga"
        :subtitle="`${sessions.length} odrađenih treninga`">
        <template #actions>
          <q-btn color="primary" unelevated icon="add" label="Novi trening" @click="showCreate = true" />
        </template>
      </PageHeader>

      <q-card class="gt-accent">
        <q-list separator>
          <q-item v-for="s in sessions" :key="s.id" clickable :to="`/sessions/${s.id}`">
            <q-item-section avatar>
              <q-avatar rounded class="gt-brand-gradient" text-color="white" icon="fitness_center" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ s.plan?.name || 'Slobodan trening' }}</q-item-label>
              <q-item-label caption>{{ formatDate(s.date) }} · {{ s.exercises.length }} vježbi</q-item-label>
            </q-item-section>
            <q-item-section side><q-icon name="chevron_right" color="grey-5" /></q-item-section>
          </q-item>
        </q-list>
        <div v-if="sessions.length === 0">
          <EmptyState icon="fitness_center" title="Još nema odrađenih treninga"
            caption="Započni trening — po izboru na temelju plana treninga.">
            <template #action><q-btn color="primary" unelevated icon="add" label="Novi trening" @click="showCreate = true" /></template>
          </EmptyState>
        </div>
      </q-card>

      <q-dialog v-model="showCreate">
        <q-card style="width: 440px; max-width: 92vw">
          <q-card-section class="text-h6">Novi trening</q-card-section>
          <q-separator />
          <q-card-section>
            <q-form @submit="createSession" class="q-gutter-md">
              <q-select v-model="form.planId" :options="planOptions" option-value="id" option-label="name"
                emit-value map-options label="Plan treninga (opcionalno)" outlined clearable />
              <q-input v-model="form.date" label="Datum" type="date" outlined required stack-label />
              <q-btn type="submit" color="primary" unelevated label="Započni trening" class="full-width" />
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/boot/axios'
import { date as qdate } from 'quasar'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'

const router = useRouter()
const sessions = ref([])
const planOptions = ref([])
const showCreate = ref(false)
const form = ref({ planId: null, date: qdate.formatDate(Date.now(), 'YYYY-MM-DD') })

function formatDate (d) {
  return qdate.formatDate(d, 'DD.MM.YYYY.')
}

async function load () {
  const [sessionsRes, plansRes] = await Promise.all([api.get('/sessions'), api.get('/plans')])
  sessions.value = sessionsRes.data.sessions
  planOptions.value = plansRes.data.plans
}

async function createSession () {
  const { data } = await api.post('/sessions', form.value)
  showCreate.value = false
  router.push(`/sessions/${data.session.id}`)
}

onMounted(load)
</script>
