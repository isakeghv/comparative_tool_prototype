<!-- <template>
    <apexchart :type="type" :options="options" :series="series" width="380"></apexchart>
</template>
  
<script setup>
import VueApexCharts from 'vue3-apexcharts';

const props = defineProps({
    type: {
        type: String,
        default: 'pie',
    },
    dataObj: {
        type: Object,
        required: true,
    },
});

// extracting labels and series from the `dataObj` prop
const labels = computed(() => Object.keys(props.dataObj));
const series = computed(() => Object.values(props.dataObj));

const colors = [
    "#6062D6",  // 'bluePrimary'
    "#bd7fc7", // lavender-purple
    "#f0a04f", // orange
    "#FFB400",  // yellow-orange
    "#e87070", // rust-red
    "#54C0D1", // 'cyan'
    "#4ece7d", // dim green
    "#8750bf", // purple
    "#379b70" // darker green
];

const options = computed(() => ({
    chart: {
        type: props.type,
    },
    labels: labels.value,
    colors: colors,
    tooltip: {
        style: {
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#FFFFFF'
        }
    },
    plotOptions: {
        pie: {
            expandOnClick: false
        }
    },
    states: {
    hover: {
        filter: {
            type: 'none'
        }
    },
    active: {
        filter: {
            type: 'none'
        }
    }
    },
    responsive: [
        {
        breakpoint: 480,
        options: {
            chart: {
            width: 200,
            },
                legend: {
                position: 'bottom',
            },
        },
        },
    ],
}));
</script>

<script>
// need to register the VueApexCharts component locally (or could move it to App lvl later idk)
export default {
    components: {
        apexchart: VueApexCharts,
    }
};
</script> -->
