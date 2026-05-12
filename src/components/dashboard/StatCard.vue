<template>
  <div
    class="relative overflow-hidden rounded-xl p-5 border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-default"
    :class="[gradientClass, isDark ? 'hover:shadow-black/30' : 'hover:shadow-gray-200']"
  >
    <!-- Background glow -->
    <div class="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20"
      :class="glowClass" />

    <!-- Content -->
    <div class="relative z-10">
      <div class="flex items-start justify-between mb-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center"
          :class="iconBgClass">
          <span class="w-5 h-5 block" v-html="icon" />
        </div>
        <!-- Trend badge -->
        <span v-if="trend !== null" class="text-xs font-medium px-2 py-0.5 rounded-full"
          :class="trend >= 0
            ? 'bg-emerald-500/15 text-emerald-400'
            : 'bg-red-500/15 text-red-400'">
          {{ trend >= 0 ? '+' : '' }}{{ trend }}%
        </span>
      </div>

      <p class="text-xs font-medium uppercase tracking-wider mb-1.5"
        :class="isDark ? 'text-gray-400' : 'text-gray-500'">
        {{ label }}
      </p>

      <p class="text-2xl font-bold tracking-tight animate-count-up"
        :class="isDark ? 'text-white' : 'text-gray-900'">
        {{ formattedValue }}
      </p>

      <p v-if="subtitle" class="text-xs mt-1.5"
        :class="isDark ? 'text-gray-500' : 'text-gray-400'">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

const props = defineProps({
  label: String,
  value: [Number, String],
  subtitle: String,
  icon: String,
  variant: {
    type: String,
    default: 'blue'
  },
  isCurrency: {
    type: Boolean,
    default: true
  },
  trend: {
    type: Number,
    default: null
  }
})

const { isDark } = useTheme()

const gradientClass = computed(() => {
  const map = {
    blue: isDark.value
      ? 'bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border-blue-500/20'
      : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
    green: isDark.value
      ? 'bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border-emerald-500/20'
      : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200',
    amber: isDark.value
      ? 'bg-gradient-to-br from-amber-500/10 to-orange-600/10 border-amber-500/20'
      : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200',
    red: isDark.value
      ? 'bg-gradient-to-br from-red-500/10 to-rose-600/10 border-red-500/20'
      : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
  }
  return map[props.variant] || map.blue
})

const glowClass = computed(() => {
  const map = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500'
  }
  return map[props.variant] || map.blue
})

const iconBgClass = computed(() => {
  const map = {
    blue: isDark.value ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600',
    green: isDark.value ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600',
    amber: isDark.value ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600',
    red: isDark.value ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
  }
  return map[props.variant] || map.blue
})

const formattedValue = computed(() => {
  if (props.isCurrency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(props.value || 0)
  }
  return props.value
})
</script>
