<template>
  <div>
    <PageHeader eyebrow="Katalog" title="Vježbe" :subtitle="`${exercises.length} vježbi${muscleGroupFilter ? ' · ' + muscleGroupFilter : ''}`">
      <template #actions>
        <button class="btn btn-primary" @click="showCreate = true">+ Nova vježba</button>
      </template>
    </PageHeader>

    <div class="chip-row">
      <button class="chip" :class="{ active: !muscleGroupFilter }" @click="setFilter(null)">Sve</button>
      <button
        v-for="mg in muscleGroups"
        :key="mg"
        class="chip"
        :class="{ active: muscleGroupFilter === mg }"
        :style="muscleGroupFilter === mg ? { background: muscleGroupColor(mg), borderColor: muscleGroupColor(mg) } : {}"
        @click="setFilter(mg)"
      >{{ mg }}</button>
    </div>

    <div class="grid grid-3">
      <div v-for="ex in exercises" :key="ex.id" class="card ex-card">
        <div class="ex-media" :style="{ borderColor: muscleGroupColor(ex.muscleGroup) }">
          <img v-if="exerciseImage(ex.name)" :src="exerciseImage(ex.name)" :alt="ex.name" />
          <div v-else class="ex-fallback" :style="{ background: muscleGroupColor(ex.muscleGroup) }">🏋️</div>
          <span class="ex-tag" :style="{ background: muscleGroupColor(ex.muscleGroup) }">{{ ex.muscleGroup }}</span>
          <button v-if="ex.isCustom" class="btn btn-icon ex-delete" title="Obriši vježbu" @click="confirmRemove(ex)">🗑</button>
        </div>
        <div class="card-body">
          <div class="title">{{ ex.name }}</div>
          <div class="caption mt-sm">{{ ex.equipment || 'bez opreme' }}<span v-if="ex.isCustom" class="badge badge-primary" style="margin-left:6px">vlastita</span></div>
          <div v-if="ex.description" class="caption mt-sm">{{ ex.description }}</div>
        </div>
      </div>
    </div>

    <div v-if="exercises.length === 0" class="card mt-md">
      <EmptyState title="Nema vježbi za odabrani filter" caption="Promijeni filter ili dodaj vlastitu vježbu.">
        <template #action>
          <button class="btn btn-primary" @click="showCreate = true">+ Nova vježba</button>
        </template>
      </EmptyState>
    </div>

    <Modal v-model="showCreate">
      <div class="modal-header">Nova vježba</div>
      <div class="modal-body">
        <form @submit.prevent="createExercise">
          <div class="field">
            <label>Naziv</label>
            <input v-model="form.name" type="text" class="input" required />
          </div>
          <div class="field">
            <label>Mišićna skupina</label>
            <select v-model="form.muscleGroup" class="input" required>
              <option value="" disabled>Odaberi...</option>
              <option v-for="mg in muscleGroups" :key="mg" :value="mg">{{ mg }}</option>
            </select>
          </div>
          <div class="field">
            <label>Oprema (opcionalno)</label>
            <input v-model="form.equipment" type="text" class="input" />
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
import { api } from '@/api'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import Modal from '@/components/Modal.vue'
import { MUSCLE_GROUPS as muscleGroups, muscleGroupColor } from '@/utils/muscleGroups'
import { exerciseImage } from '@/utils/exerciseImages'

const exercises = ref([])
const muscleGroupFilter = ref(null)

const showCreate = ref(false)
const form = ref({ name: '', muscleGroup: '', equipment: '', description: '' })

async function load() {
  const data = await api.get('/exercises', muscleGroupFilter.value ? { muscleGroup: muscleGroupFilter.value } : null)
  exercises.value = data.exercises
}

function setFilter(mg) {
  muscleGroupFilter.value = mg
  load()
}

async function createExercise() {
  await api.post('/exercises', form.value)
  showCreate.value = false
  form.value = { name: '', muscleGroup: '', equipment: '', description: '' }
  await load()
}

async function confirmRemove(ex) {
  if (!confirm(`Sigurno želiš obrisati vježbu "${ex.name}"?`)) return
  try {
    await api.delete(`/exercises/${ex.id}`)
    await load()
  } catch (err) {
    alert(err.message || 'Vježbu nije moguće obrisati (možda se koristi u planu ili treningu).')
  }
}

onMounted(load)
</script>

<style scoped>
.ex-card { display: flex; flex-direction: column; }
.ex-media {
  position: relative;
  height: 150px;
  border-bottom: 3px solid;
  background: var(--surface-2);
  overflow: hidden;
}
.ex-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ex-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2rem; }
.ex-tag {
  position: absolute; left: 8px; bottom: 8px;
  color: #fff; font-weight: 700; font-size: 0.7rem;
  padding: 3px 8px; border-radius: 6px;
}
.ex-delete {
  position: absolute; top: 8px; right: 8px;
  background: rgba(0,0,0,0.55); color: #fff;
}
</style>
