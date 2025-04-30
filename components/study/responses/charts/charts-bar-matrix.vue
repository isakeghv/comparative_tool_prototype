<template>
    <div class="chart__cont">
      <apexchart :options="options" :series="series" width="380" />
  
      <div class="legend__cont">
            <div
                v-for="(label, idx) in labels"
                :key="idx"
                class="legend__item"
                @mouseenter="hoveredIndex = idx"
                @mouseleave="hoveredIndex = null"
            >

            <span :style="{ backgroundColor: colors[idx] }" class="legend__dot"></span>
    
            <span class="legend__text">{{ label }}</span>
    
            <div v-if="hoveredIndex === idx" class="tooltip font-small">
                {{ label }}
            </div>
        </div>
      </div>
    </div>
  </template>
  
<script setup>
import VueApexCharts from 'vue3-apexcharts';

const props = defineProps({
	dataObj: {
		type: Object,
		required: true
	}
});

const hoveredIndex = ref(null);

const labels = computed(() => {
    // only unique labels are allowed for the chart
    const labelSet = new Set();

    Object.values(props.dataObj).forEach(obj => {
        Object.keys(obj).forEach(k => labelSet.add(k));
    });

    return Array.from(labelSet);
});

const series = computed(() => {
    return labels.value.map((label, idx) => ({
        name: label,
        data: Object.keys(props.dataObj).map(file => props.dataObj[file][label] || 0)
    }));
});

const categories = computed(() => Object.keys(props.dataObj));

// need to pick other colors later
const colors = [
	"#6062D6", "#bd7fc7", "#e87070", "#54C0D1",
	"#4ece7d", "#8750bf", "#379b70"
];

const options = computed(() => ({
  chart: {
        type: 'bar',
        stacked: true,
        animations: { enabled: false },
        toolbar: { show: false }
    },
    xaxis: {
        categories: categories.value
    },
    colors: colors,
    tooltip: {
        enabled: true
    },
    legend: {
        show: false
    },
    plotOptions: {
        bar: {
            horizontal: false
        }
    }
}));
</script>

<script>
export default {
	components: {
		apexchart: VueApexCharts
	}
};
</script>
  
<style scoped>
	@import url('public/style/components/charts/charts-pie.scss');
</style>
