<template>
    <div class="chart__cont">
		<apexchart :options="options" :series="series" width="500" />
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

const labels = computed(() => Object.keys(props.dataObj));
const series = computed(() => Object.values(props.dataObj));

// need to pick other colors later
const colors = [
	"#6062D6", "#bd7fc7", "#e87070", "#54C0D1",
	"#4ece7d", "#8750bf", "#379b70"
];

const options = computed(() => ({
	chart: {
		type: 'pie',
		animations: { enabled: false },
		toolbar: { show: false },
	},
	labels: labels.value,
	colors: colors,
	tooltip: { enabled: true },
	legend: {
		show: true
	},
	plotOptions: {
		pie: {
			expandOnClick: false
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
	@import url('public/style/components/charts/charts.scss');

	:deep(.apexcharts-legend-text) {
		display: inline-block;
		min-width: 20ch;
		max-width: 20ch;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
}
</style>
