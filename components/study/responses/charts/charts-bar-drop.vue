<template>
    <div class="chart__cont">
      <apexchart :options="options" :series="series" height="400" width="380" />
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
        show: true
    },
    plotOptions: {
        bar: {
            horizontal: false
        }
    },
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
	@import url('public/style/components/charts/charts.scss');
</style>
