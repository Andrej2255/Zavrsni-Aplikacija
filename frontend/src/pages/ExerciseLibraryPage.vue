<template>
  <q-page class="q-pa-md q-pa-lg-xl">
    <div class="gt-wrap">
      <PageHeader eyebrow="Katalog" title="Vježbe"
        :subtitle="`${exercises.length} vježbi${muscleGroupFilter ? ' · ' + muscleGroupFilter : ''}`">
        <template #actions>
          <q-btn color="primary" unelevated icon="add" label="Nova vježba" @click="showCreate = true" />
        </template>
      </PageHeader>

      <div class="row items-center q-gutter-sm q-mb-lg">
        <q-chip clickable size="md" class="gt-filter-chip"
          :class="{ 'gt-filter-chip--on': !muscleGroupFilter }"
          :style="!muscleGroupFilter ? { background: 'var(--gt-primary)', color: '#fff' } : {}"
          @click="setFilter(null)">Sve</q-chip>
        <q-chip v-for="mg in muscleGroups" :key="mg" clickable size="md" class="gt-filter-chip"
          :class="{ 'gt-filter-chip--on': muscleGroupFilter === mg }"
          :style="muscleGroupFilter === mg ? { background: muscleGroupMeta(mg).color, color: '#fff' } : {}"
          :icon="muscleGroupMeta(mg).icon" @click="setFilter(mg)">{{ mg }}</q-chip>
      </div>

      <div class="row q-col-gutter-md">
        <div v-for="ex in exercises" :key="ex.id" class="col-12 col-sm-6 col-md-4">
          <q-card class="gt-card-hover full-height column">
            <div class="gt-ex-media" :style="{ '--mg': muscleGroupMeta(ex.muscleGroup).color }">
              <img v-if="exerciseImage(ex.name)" :src="exerciseImage(ex.name)" :alt="ex.name" class="gt-ex-img" />
              <div v-else class="gt-ex-fallback" :style="{ background: muscleGroupGradient(ex.muscleGroup) }">
                <q-icon :name="muscleGroupMeta(ex.muscleGroup).icon" size="40px" />
              </div>
              <span class="gt-ex-tag" :style="{ background: muscleGroupMeta(ex.muscleGroup).color }">
                <q-icon :name="muscleGroupMeta(ex.muscleGroup).icon" size="13px" /> {{ ex.muscleGroup }}
              </span>
              <q-btn v-if="ex.isCustom" round dense unelevated icon="delete" class="gt-ex-del"
                @click="confirmRemove(ex)">
                <q-tooltip>Obriši vježbu</q-tooltip>
              </q-btn>
            </div>
            <q-card-section class="col">
              <div class="text-subtitle1 text-weight-bold ellipsis">{{ ex.name }}</div>
              <div class="row items-center q-gutter-xs q-mt-xs">
                <q-chip dense square class="gt-eq-chip" icon="sports_gymnastics">
                  {{ ex.equipment || 'bez opreme' }}
                </q-chip>
                <q-badge v-if="ex.isCustom" color="secondary" label="vlastita" />
              </div>
              <div v-if="ex.description" class="text-body2 gt-muted q-mt-sm ellipsis-2-lines">{{ ex.description }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-card v-if="exercises.length === 0" flat class="gt-flat q-mt-md">
        <EmptyState icon="fitness_center" title="Nema vježbi za odabrani filter"
          caption="Promijeni filter ili dodaj vlastitu vježbu.">
          <template #action><q-btn color="primary" unelevated icon="add" label="Nova vježba" @click="showCreate = true" /></template>
        </EmptyState>
      </q-card>

      <q-dialog v-model="showCreate">
        <q-card style="width: 440px; max-width: 92vw">
          <q-card-section class="text-h6">Nova vježba</q-card-section>
          <q-separator />
          <q-card-section>
            <q-form @submit="createExercise" class="q-gutter-md">
              <q-input v-model="form.name" label="Naziv" outlined required />
              <q-select v-model="form.muscleGroup" :options="muscleGroups" label="Mišićna skupina" outlined required />
              <q-input v-model="form.equipment" label="Oprema (opcionalno)" outlined />
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
import { useQuasar } from 'quasar'
import { api } from '@/boot/axios'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import { MUSCLE_GROUPS as muscleGroups, muscleGroupMeta, muscleGroupGradient } from '@/utils/muscleGroups'
import { exerciseImage } from '@/utils/exerciseImages'

const $q = useQuasar()
const exercises = ref([])
const muscleGroupFilter = ref(null)

const showCreate = ref(false)
const form = ref({ name: '', muscleGroup: '', equipment: '', description: '' })

async function load () {
  const { data } = await api.get('/exercises', {
    params: muscleGroupFilter.value ? { muscleGroup: muscleGroupFilter.value } : {},
  })
  exercises.value = data.exercises
}

function setFilter (mg) {
  muscleGroupFilter.value = mg
  load()
}

async function createExercise () {
  await api.post('/exercises', form.value)
  showCreate.value = false
  form.value = { name: '', muscleGroup: '', equipment: '', description: '' }
  $q.notify({ type: 'positive', message: 'Vježba dodana', icon: 'check' })
  await load()
}

function confirmRemove (ex) {
  $q.dialog({
    title: 'Obriši vježbu',
    message: `Sigurno želiš obrisati vježbu "${ex.name}"?`,
    cancel: { label: 'Odustani', flat: true },
    ok: { label: 'Obriši', color: 'negative', unelevated: true },
  }).onOk(async () => {
    try {
      await api.delete(`/exercises/${ex.id}`)
      $q.notify({ type: 'positive', message: 'Vježba obrisana', icon: 'check' })
      await load()
    } catch (err) {
      $q.notify({
        type: 'negative',
        message: err.response?.data?.error || 'Vježbu nije moguće obrisati (možda se koristi u planu ili treningu).',
      })
    }
  })
}

onMounted(load)
</script>

<style scoped>
.gt-filter-chip {
  border: 1px solid var(--gt-border); font-weight: 700;
  background: var(--gt-surface-2); color: var(--gt-ink);
}
.gt-filter-chip--on { border-color: transparent; }
.gt-eq-chip { background: var(--gt-surface-2); color: var(--gt-muted); }
.ellipsis-2-lines { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.gt-ex-media {
  position: relative; height: 168px; overflow: hidden;
  border-bottom: 3px solid var(--mg);
  background: #fff;
}
.gt-ex-img { width: 100%; height: 100%; object-fit: cover; object-position: center 42%; display: block; }
.gt-ex-fallback {
  width: 100%; height: 100%; display: grid; place-items: center; color: #fff;
}
.gt-ex-tag {
  position: absolute; left: 10px; bottom: 10px;
  display: inline-flex; align-items: center; gap: 4px;
  color: #fff; font-weight: 800; font-size: .72rem;
  padding: 4px 9px; border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,.25);
}
.gt-ex-del {
  position: absolute; top: 8px; right: 8px;
  background: rgba(15, 12, 22, .62);
  color: #fff;
  backdrop-filter: blur(4px);
  opacity: .92; transition: background-color .14s ease, transform .12s ease;
}
.gt-ex-del:hover { background: var(--q-negative, #F43F5E); transform: scale(1.06); }
</style>
