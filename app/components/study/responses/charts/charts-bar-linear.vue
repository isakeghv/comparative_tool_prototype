<template>
    <div class="chart__cont">
        <apexchart :options="options" :series="series" height="300" width="500" />
    </div>
</template>
  
<script setup>
import VueApexCharts from 'vue3-apexcharts';

const props = defineProps({
    dataObj: {
        type: Object,
        required: true
    },
	startLabel: { type: String },
	endLabel: { type: String },
	min: { type: Number },
	max: {
		type: Number,
		required: true
	}
});

const categories = computed(() => Object.keys(props.dataObj));

const series = computed(() => [{
	data: Object.values(props.dataObj)
}]);

const colors = [
	"#6062D6", "#bd7fc7", "#e87070", "#54C0D1",
	"#4ece7d", "#8750bf", "#379b70"
];

const options = computed(() => ({
	chart: {
		type: 'bar',
		toolbar: { show: false },
		animations: { enabled: false }
	},
	colors: colors,
	plotOptions: {
		bar: {
			horizontal: true,
			barHeight: '60%',
			distributed: true
		}
	},
	dataLabels: {
		enabled: true,
		formatter: val => `${val.toFixed(2)}`
	},
	xaxis: {
		categories: categories.value,
		max: props.max,
		min: props.min || 1
	},
	yaxis: {
		labels: {
			style: {
				fontSize: '12px'
			},
			offsetX: -15
		}
	},
	annotations: {
		xaxis: [
			{
				x: props.max,
				label: {
					text: props.endLabel,
					style: {
						fontSize: '12px',
					}
				}
			},
			{
				x: 1,
				label: {
					text: props.startLabel,
					style: {
						fontSize: '12px',
					}
				}
			}
		]
	},
	tooltip: {
		enabled: true
	},
	legend: {
		show: false
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

</style>
