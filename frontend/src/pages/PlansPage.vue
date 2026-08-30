<template>
  <q-page class="q-pa-md q-pa-lg-xl">
    <div class="gt-wrap">
      <PageHeader eyebrow="Trening" title="Planovi treninga"
        :subtitle="`${plans.length} ${plans.length === 1 ? 'plan' : 'planova'}`">
        <template #actions>
          <q-btn color="primary" unelevated icon="add" label="Novi plan" @click="showCreate = true" />
        </template>
      </PageHeader>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-4" v-for="(plan, i) in plans" :key="plan.id">
          <q-card class="gt-card-hover full-height column">
            <div class="gt-plan-head" :style="{ background: planGradient(i) }">
              <q-icon name="assignment" size="20px" />
              <span class="text-weight-bold ellipsis">{{ plan.name }}</span>
            </div>
            <q-card-section class="col">
              <div class="text-body2 gt-muted ellipsis-2-lines" style="min-height:2.6em">
                {{ plan.description || 'Bez opisa' }}
              </div>
              <q-chip dense square :style="{ background: planColor(i) + '1f', color: planColor(i) }" icon="fitness_center" class="q-mt-sm">
                {{ plan.exercises.length }} vježbi
              </q-chip>
            </q-card-section>
            <q-separator />
            <q-card-actions align="between">
              <q-btn flat color="primary" icon="edit" label="Uredi" :to="`/plans/${plan.id}`" />
              <q-btn flat round color="grey-6" icon="delete" @click="confirmRemove(plan)" />
            </q-card-actions>
          </q-card>
        </div>

        <div v-if="plans.length === 0" class="col-12">
          <q-card flat class="gt-flat">
            <EmptyState icon="assignment" title="Još nemaš planova treninga"
              caption="Kreiraj plan pa mu dodaj vježbe s ciljanim serijama i kilažom.">
              <template #action><q-btn color="primary" unelevated icon="add" label="Novi plan" @click="showCreate = true" /></template>
            </EmptyState>
          </q-card>
        </div>
      </div>

      <q-dialog v-model="showCreate">
        <q-card style="width: 440px; max-width: 92vw">
          <q-card-section class="text-h6">Novi plan treninga</q-card-section>
          <q-separator />
          <q-card-section>
            <q-form @submit="createPlan" class="q-gutter-md">
              <q-input v-model="form.name" label="Naziv plana" outlined required />
              <q-input v-model="form.description" label="Opis (opcionalno)" type="textarea" outlined autogrow />
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
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from '@/boot/axios'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'

const router = useRouter()
const $q = useQuasar()
const plans = ref([])

const PALETTE = ['#5E3BEE', '#12B981', '#3B82F6', '#FF6B35', '#EC4899', '#F59E0B']
const planColor = (i) => PALETTE[i % PALETTE.length]
const planGradient = (i) => {
  const c = planColor(i)
  return `linear-gradient(135deg, ${c} 0%, ${c}cc 100%)`
}
const showCreate = ref(false)
const form = ref({ name: '', description: '' })

async function load () {
  const { data } = await api.get('/plans')
  plans.value = data.plans
}

async function createPlan () {
  const { data } = await api.post('/plans', form.value)
  showCreate.value = false
  form.value = { name: '', description: '' }
  router.push(`/plans/${data.plan.id}`)
}

function confirmRemove (plan) {
  $q.dialog({
    title: 'Obriši plan',
    message: `Sigurno želiš obrisati plan "${plan.name}"?`,
    cancel: true,
    ok: { label: 'Obriši', color: 'negative', unelevated: true },
  }).onOk(async () => {
    await api.delete(`/plans/${plan.id}`)
    await load()
  })
}

onMounted(load)
</script>

<style scoped>
.gt-plan-head {
  display: flex; align-items: center; gap: 10px;
  padding: 16px 18px;
  color: #fff;
  background: var(--gt-brand-gradient);
}
.ellipsis-2-lines {
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
</style>
