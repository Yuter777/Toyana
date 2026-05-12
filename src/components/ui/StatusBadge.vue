<template>
  <span
    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
    :class="badgeClass"
  >
    <span class="w-1.5 h-1.5 rounded-full" :class="dotClass" />
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const HOLAT = {
  Returned: { label: 'Berildi',     badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20', dot: 'bg-emerald-400' },
  Pending:  { label: 'Kutilmoqda',  badge: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',     dot: 'bg-amber-400' },
  Partial:  { label: 'Qisman',      badge: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',        dot: 'bg-blue-400' },
  Overdue:  { label: 'Kechikkan',   badge: 'bg-red-600/20 text-red-300 border border-red-600/30',           dot: 'bg-red-300 animate-pulse' },
}

const current = computed(
  () => HOLAT[props.status] || { label: props.status, badge: 'bg-gray-500/15 text-gray-400 border border-gray-500/20', dot: 'bg-gray-400' }
)
const label = computed(() => current.value.label)
const badgeClass = computed(() => current.value.badge)
const dotClass = computed(() => current.value.dot)
</script>
