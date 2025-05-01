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
	max: {
		type: Number,
		required: true
	}
});

const categories = computed(() => Object.keys(props.dataObj));

const series = computed(() => [{
	data: Object.values(props.dataObj)
}]);

const options = computed(() => ({
	chart: {
		type: 'bar',
		toolbar: { show: false },
		animations: { enabled: false }
	},
	plotOptions: {
		bar: {
		horizontal: true,
		barHeight: '60%'
		}
	},
	dataLabels: {
		enabled: true,
		formatter: val => `${val.toFixed(2)}`
	},
	xaxis: {
		categories: categories.value,
		max: props.max,
		min: 1
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
	colors: ['#6062D6'],
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
