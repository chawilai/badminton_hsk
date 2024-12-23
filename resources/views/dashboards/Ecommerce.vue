<script setup>
import { ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { FilterMatchMode } from 'primevue/api';

const { layoutConfig } = useLayout();

const chartData = ref(null);
const chartOptions = ref(null);
const chart1 = ref(null);
const chartOptions1 = ref(null);
const pieData = ref(null);
const pieOptions = ref(null);
const menu = ref(null);
const menu2 = ref(null);
const expandedRows = ref([]);
const isDarkMode = ref(false);

const orders = ref({
    monthlyData: {
        dateRange: 'last 12 month',
        orders: [122, 584, 646, 221, 135, 453, 111, 158, 425, 156, 454, 456],
        orderUnits: [145, 584, 676, 281, 137, 459, 136, 178, 435, 176, 456, 480],
        avarageUnitByOrder: 1.2,
        avarageSalesByOrder: '$28.00',
        totalSales: '$109,788.00'
    },
    weeklyData: {
        dateRange: 'last 24 week',
        orders: [28, 58, 44, 16, 42, 8, 15, 26, 38, 46, 15, 46, 89, 45, 41, 22, 17, 43, 12, 45, 24, 16, 54, 49],
        orderUnits: [32, 62, 48, 19, 49, 10, 16, 26, 38, 54, 19, 52, 100, 53, 41, 22, 26, 43, 18, 47, 29, 18, 62, 51],
        avarageUnitByOrder: 1.2,
        avarageSalesByOrder: '$24.00',
        totalSales: '$20,136.00'
    },
    dailyData: {
        dateRange: 'last 30 days',
        orders: [8, 5, 4, 6, 2, 8, 5, 2, 8, 6, 5, 6, 12, 8, 11, 6, 2, 8, 3, 4, 6, 2, 11, 6, 4, 7, 6, 7, 6, 4],
        orderUnits: [10, 6, 5, 6, 2, 8, 5, 6, 8, 6, 7, 7, 12, 12, 14, 6, 2, 8, 7, 4, 6, 5, 13, 6, 7, 9, 6, 7, 6, 6],
        avarageUnitByOrder: 1.2,
        avarageSalesByOrder: '$29.00',
        totalSales: '$5,162.00'
    }
});
const dateRanges = ref([
    { name: 'Daily', code: 'DAY' },
    { name: 'Weekly', code: 'WEEK' },
    { name: 'Monthly', code: 'MONTH' }
]);

const selectedDate = ref('');

const items = ref([
    {
        icon: 'pi pi-check',
        label: 'Complete'
    },
    {
        icon: 'pi pi-times',
        label: 'Cancel'
    },
    {
        icon: 'pi pi-external-link',
        label: 'Details'
    }
]);

const activeAds = ref([
    {
        image: '/demo/images/product/black-watch.jpg',
        name: 'Experience Timeless Elegance with the Black-Watch',
        adDesc: `Upgrade your style with the Black-Watch. Its sleek and sophisticated design will elevate your wardrobe to new heights. With its precise timekeeping, you'll never miss an important appointment again. Invest in a piece that will last a lifetime. Get your Black-Watch today.`,
        adCTR: '6%',
        adROI: '10%',
        detailedData: [
            {
                name: 'Mail',
                adROI: '10%',
                adCTR: '3%',
                adCR: '2%',
                impressions: 5000,
                clicks: 100,
                adCPA: '$50.00',
                adCPC: '$2.00'
            },
            {
                name: 'Google Ads',
                adROI: '15%',
                adCTR: '6%',
                adCR: '4%',
                impressions: 10000,
                clicks: 400,
                adCPA: '$37.50',
                adCPC: '$1.50'
            },
            {
                name: 'FB Ads',
                adROI: '20%',
                adCTR: '7%',
                adCR: '5%',
                impressions: 15000,
                clicks: 750,
                adCPA: '$31.25',
                adCPC: '$1.25'
            }
        ]
    },
    {
        image: '/demo/images/product/green-earbuds.jpg',
        name: 'Eco-Friendly Sound with Green-Earbuds',
        adDesc: `Listen to your music while helping the environment with Green-Earbuds. Made with sustainable materials, these earbuds offer high-quality sound while reducing your carbon footprint. With a comfortable fit and long battery life, you can enjoy your music all day. Join the eco-movement and get your Green-Earbuds today.`,
        adCTR: '6%',
        adROI: '15%',
        detailedData: [
            {
                name: 'Mail',
                adROI: '10%',
                adCTR: '3%',
                adCR: '2%',
                impressions: 5000,
                clicks: 100,
                adCPA: '$50.00',
                adCPC: '$2.00'
            },
            {
                name: 'Google Ads',
                adROI: '15%',
                adCTR: '6%',
                adCR: '4%',
                impressions: 10000,
                clicks: 400,
                adCPA: '$37.50',
                adCPC: '$1.50'
            },
            {
                name: 'FB Ads',
                adROI: '20%',
                adCTR: '7%',
                adCR: '5%',
                impressions: 15000,
                clicks: 750,
                adCPA: '$31.25',
                adCPC: '$1.25'
            }
        ]
    },
    {
        image: '/demo/images/product/yoga-set.jpg',
        name: 'Find Your Zen with the Yoga-Set',
        adDesc: `Take your yoga practice to the next level with the Yoga-Set. This comprehensive kit includes everything you need to enhance your stretch and strength. Whether you're a beginner or an experienced practitioner, the non-slip mat, blocks, and strap will support you in your journey. Embrace a healthier, happier lifestyle with the Yoga-Set. Order now.`,
        adCTR: '6%',
        adROI: '10%',
        detailedData: [
            {
                name: 'Mail',
                adROI: '10%',
                adCTR: '3%',
                adCR: '2%',
                impressions: 5000,
                clicks: 100,
                adCPA: '$50.00',
                adCPC: '$2.00'
            },
            {
                name: 'Google Ads',
                adROI: '15%',
                adCTR: '6%',
                adCR: '4%',
                impressions: 10000,
                clicks: 400,
                adCPA: '$37.50',
                adCPC: '$1.50'
            },
            {
                name: 'FB Ads',
                adROI: '20%',
                adCTR: '7%',
                adCR: '5%',
                impressions: 15000,
                clicks: 750,
                adCPA: '$31.25',
                adCPC: '$1.25'
            }
        ]
    },
    {
        image: '/demo/images/product/gold-phone-case.jpg',
        name: 'Add a Touch of Luxury to Your Phone with the Gold Case',
        adDesc: `Make a statement with the Gold Phone Case. Its sleek and stylish design will turn heads and keep your phone protected. Crafted with premium materials, this case will not only protect your phone but also elevate your style. Don't settle for a boring case. Get the Gold Phone Case today.`,
        adCTR: '6%',
        adROI: '13%',
        detailedData: [
            {
                name: 'Mail',
                adROI: '10%',
                adCTR: '3%',
                adCR: '2%',
                impressions: 5000,
                clicks: 100,
                adCPA: '$50.00',
                adCPC: '$2.00'
            },
            {
                name: 'Google Ads',
                adROI: '15%',
                adCTR: '6%',
                adCR: '4%',
                impressions: 10000,
                clicks: 400,
                adCPA: '$37.50',
                adCPC: '$1.50'
            },
            {
                name: 'FB Ads',
                adROI: '20%',
                adCTR: '7%',
                adCR: '5%',
                impressions: 15000,
                clicks: 750,
                adCPA: '$31.25',
                adCPC: '$1.25'
            }
        ]
    },
    {
        image: '/demo/images/product/bamboo-watch.jpg',
        name: 'Eco-Friendly Timepiece: Experience Style with our Bamboo Watch',
        adDesc: `Stay on time and on trend with the Bamboo-Watch. Made with sustainable bamboo materials, this watch not only looks great but also helps protect the environment. With its precise timekeeping and versatile design, the Bamboo-Watch is perfect for any occasion. Get yours today and join the eco-movement in style.`,
        adCTR: '6%',
        adROI: '22%',
        detailedData: [
            {
                name: 'Mail',
                adROI: '10%',
                adCTR: '3%',
                adCR: '2%',
                impressions: 5000,
                clicks: 100,
                adCPA: '$50.00',
                adCPC: '$2.00'
            },
            {
                name: 'Google Ads',
                adROI: '15%',
                adCTR: '6%',
                adCR: '4%',
                impressions: 10000,
                clicks: 400,
                adCPA: '$37.50',
                adCPC: '$1.50'
            },
            {
                name: 'FB Ads',
                adROI: '20%',
                adCTR: '7%',
                adCR: '5%',
                impressions: 15000,
                clicks: 750,
                adCPA: '$31.25',
                adCPC: '$1.25'
            }
        ]
    }
]);

const sumOf = (array) => {
    let sum = 0;
    array.forEach((a) => (sum += a));
    return sum;
};

const initChart = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    chartData.value = {
        labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
        datasets: [
            {
                label: 'Orders',
                data: orders.value.dailyData.orders,
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--primary-color'),
                borderRadius: 6
            },

            {
                label: 'Units',
                data: orders.value.dailyData.orderUnits,
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--primary-light-color'),
                borderRadius: 6
            }
        ]
    };
    chartOptions.value = {
        animation: {
            duration: 0
        },
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: {
                labels: {
                    color: textColor,
                    usePointStyle: true,
                    boxHeight: 15,
                    pointStyleWidth: 17,
                    padding: 14
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };

    chart1.value = {
        labels: ['8Sun', '9Mon', '10Thu', '11Wed', '12Fri', '13Sat', '14Sun'],
        datasets: [
            {
                label: 'New Clients',
                data: [12, 19, 15, 28, 32, 22, 39],
                borderColor: documentStyle.getPropertyValue('--primary-light-color'),
                borderWidth: 4,
                fill: true,
                backgroundColor: documentStyle.getPropertyValue('--primary-lighter-color'),
                tension: 0.4
            }
        ]
    };
    chartOptions1.value = {
        plugins: {
            legend: {
                labels: {
                    color: textColor,
                    usePointStyle: true,
                    boxHeight: 15,
                    pointStyleWidth: 17,
                    padding: 14
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        },

        maintainAspectRatio: false,
        hover: {
            mode: 'index'
        },
        scales: {
            x: {
                display: false
            },
            y: {
                display: false
            }
        }
    };

    pieData.value = {
        labels: ['Watches', 'Clothing', 'Gadgets', 'Accessories'],
        datasets: [
            {
                data: [300, 50, 100, 80],
                backgroundColor: [documentStyle.getPropertyValue('--primary-300'), documentStyle.getPropertyValue('--orange-300'), documentStyle.getPropertyValue('--green-300'), documentStyle.getPropertyValue('--cyan-300')],
                borderColor: surfaceBorder
            }
        ]
    };
    pieOptions.value = {
        animation: {
            duration: 0
        },
        plugins: {
            legend: {
                display: false,
                labels: {
                    display: false
                },
                position: 'bottom'
            }
        }
    };
};

watch(selectedDate, () => {
    onDateChangeBarChart();
});

watch(
    () => layoutConfig.colorScheme.value,
    (newValue) => {
        isDarkMode.value = newValue === 'dark';
        initChart();
    },
    { immediate: true }
);

watch(
    layoutConfig.theme,
    () => {
        initChart();
    },
    { immediate: true }
);

function onDateChangeBarChart() {
    const documentStyle = getComputedStyle(document.documentElement);

    const monthlyData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Orders',
                data: orders.value.monthlyData.orders,
                fill: false,
                tension: 0.4,
                borderWidth: 2,
                backgroundColor: documentStyle.getPropertyValue('--primary-color'),
                borderRadius: 6
            },
            {
                label: 'Units',
                data: [1200, 5100, 6200, 3300, 2100, 6200, 4500, 1200, 5100, 6200, 3300, 2100],
                backgroundColor: documentStyle.getPropertyValue('--primary-light-color'),
                tension: 0.4,
                borderWidth: 2,
                borderRadius: 6
            }
        ]
    };

    const dailyData = {
        labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
        datasets: [
            {
                label: 'Orders',
                data: orders.value.dailyData.orders,
                fill: false,
                tension: 0.4,
                borderWidth: 2,
                backgroundColor: documentStyle.getPropertyValue('--primary-color'),
                borderRadius: 6
            },
            {
                label: 'Units',
                data: orders.value.dailyData.orderUnits,
                backgroundColor: documentStyle.getPropertyValue('--primary-light-color'),
                tension: 0.4,
                borderWidth: 2,
                borderRadius: 6
            }
        ]
    };

    const weeklyData = {
        labels: [
            'Week 1',
            'Week 2',
            'Week 3',
            'Week 4',
            'Week 5',
            'Week 6',
            'Week 7',
            'Week 8',
            'Week 9',
            'Week 10',
            'Week 11',
            'Week 12',
            'Week 13',
            'Week 14',
            'Week 15',
            'Week 16',
            'Week 17',
            'Week 18',
            'Week 19',
            'Week 20',
            'Week 21',
            'Week 22',
            'Week 23',
            'Week 24'
        ],
        datasets: [
            {
                label: 'Orders',
                data: orders.value.weeklyData.orders,
                fill: false,
                tension: 0.4,
                borderWidth: 2,
                backgroundColor: documentStyle.getPropertyValue('--primary-color'),
                borderRadius: 6
            },
            {
                label: 'Units',
                data: orders.value.weeklyData.orderUnits,
                backgroundColor: documentStyle.getPropertyValue('--primary-light-color'),
                tension: 0.4,
                borderWidth: 2,
                borderRadius: 6
            }
        ]
    };

    let newBarData = { ...chartData.value };
    switch (selectedDate.value.name) {
        case 'Monthly':
            newBarData = monthlyData;
            break;
        case 'Weekly':
            newBarData = weeklyData;
            break;
        case 'Daily':
            newBarData = dailyData;
            break;
        default:
            break;
    }

    chartData.value = newBarData;
}
const filterSalesTable = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <Message
                class="w-full border-round-3xl surface-card font-medium text-color-secondary -mt-1 ml-2"
                :class="{ 'dark-mode': isDarkMode }"
                :pt="{
                    root: { style: { borderLeft: 'none' } },
                    icon: { class: 'hidden' },
                    closeButton: { class: isDarkMode ? 'text-white' : 'text-black' }
                }"
            >
                👋 Hello! Welcome to Freya! Before start please complete your profile to know you better.</Message
            >

            <div class="grid p-2" style="margin: -1rem">
                <div class="col-12 sm:col p-3">
                    <div class="card surface-card text-500 flex justify-content-between pt-4 h-full" style="min-width: 17rem">
                        <div class="overview-info">
                            <h6 class="m-0 mb-1 text-500">Orders</h6>
                            <h1 class="m-0 text-500">23</h1>
                        </div>
                        <i class="pi pi-chart-line text-3xl"></i>
                    </div>
                </div>
                <div class="col-12 sm:col p-3">
                    <div class="card text-0 flex justify-content-between pt-4 h-full" style="background-color: var(--primary-color); min-width: 17rem">
                        <div class="overview-info">
                            <h6 class="m-0 mb-1 text-0">Revenue</h6>
                            <h1 class="m-0 text-0">$1548.26</h1>
                        </div>
                        <i class="pi pi-dollar text-3xl"></i>
                    </div>
                </div>
                <div class="col-12 sm:col p-3">
                    <div class="card bg-gray-400 text-white flex justify-content-between pt-4 h-full" style="min-width: 17rem">
                        <div class="overview-info">
                            <h6 class="m-0 mb-1 text-white">Buyer Messages</h6>
                            <h1 class="m-0 text-white">2</h1>
                        </div>
                        <i class="pi pi-envelope text-3xl"></i>
                    </div>
                </div>
                <div class="col-12 sm:col p-3">
                    <div class="card bg-gray-600 text-white flex justify-content-between pt-4 h-full" style="min-width: 17rem">
                        <div class="overview-info">
                            <h6 class="m-0 mb-1 text-white">CTR</h6>
                            <h1 class="m-0 text-white">12%</h1>
                        </div>
                        <i class="pi pi-chart-bar text-3xl"></i>
                    </div>
                </div>
                <div class="col-12 sm:col p-3">
                    <div class="card text-white flex justify-content-between pt-4 h-full" style="background: linear-gradient(90deg, #ffb340 0%, #ffa740 100%); min-width: 17rem">
                        <div class="overview-info">
                            <h6 class="m-0 mb-1 text-white">Out of Stock Products</h6>
                            <h1 class="m-0 text-white">4</h1>
                        </div>
                        <i class="pi pi-box text-3xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 xl:col-8 p-3">
            <div class="card">
                <div class="card-header gap-3">
                    <div class="card-title">
                        <h6>Orders</h6>
                        <p class="subtitle">
                            Your <b>{{ selectedDate?.name }}</b> orders data from
                            <b>
                                {{ selectedDate?.code == 'DAY' ? orders?.dailyData?.dateRange : selectedDate?.code == 'WEEK' ? orders?.weeklyData?.dateRange : orders?.monthlyData?.dateRange }}
                            </b>
                        </p>
                    </div>
                    <Dropdown :options="dateRanges" v-model="selectedDate" placeholder="Monthly" optionLabel="name" :showClear="false" class="w-9rem" @onChange="onDateChangeBarChart()"></Dropdown>
                </div>
                <div class="chart-info mb-3 flex align-items-center gap-5 flex-wrap">
                    <div class="info">
                        <h6 class="m-0 mb-1 text-color-secondary font-normal">Total Orders</h6>
                        <p class="m-0 p-0 font-bold">
                            {{ selectedDate?.code == 'DAY' ? sumOf(orders?.dailyData?.orders) : selectedDate?.code == 'WEEK' ? sumOf(orders?.weeklyData?.orders) : sumOf(orders?.monthlyData?.orders) }}
                        </p>
                    </div>
                    <div class="info">
                        <h6 class="m-0 mb-1 text-color-secondary font-normal">Total Units</h6>
                        <p class="m-0 p-0 font-bold">
                            {{ selectedDate?.code == 'DAY' ? sumOf(orders?.dailyData?.orderUnits) : selectedDate?.code == 'WEEK' ? sumOf(orders?.weeklyData?.orderUnits) : sumOf(orders?.monthlyData?.orderUnits) }}
                        </p>
                    </div>
                    <div class="info">
                        <h6 class="m-0 mb-1 text-color-secondary font-normal">Total Sales</h6>
                        <p class="m-0 p-0 font-bold">
                            {{ selectedDate?.code == 'DAY' ? orders?.dailyData?.totalSales : selectedDate?.code == 'WEEK' ? orders?.weeklyData?.totalSales : orders?.monthlyData?.totalSales }}
                        </p>
                    </div>
                    <div class="info">
                        <h6 class="m-0 mb-1 text-color-secondary font-normal">Avg. sales/orders item</h6>
                        <p class="m-0 p-0 font-bold">
                            {{ selectedDate?.code == 'DAY' ? orders?.dailyData?.avarageSalesByOrder : selectedDate?.code == 'WEEK' ? orders?.weeklyData?.avarageSalesByOrder : orders?.monthlyData?.avarageSalesByOrder }}
                        </p>
                    </div>
                    <div class="info">
                        <h6 class="m-0 mb-1 text-color-secondary font-normal">Avg. units/orders item</h6>
                        <p class="m-0 p-0 font-bold">
                            {{ selectedDate?.code == 'DAY' ? orders?.dailyData?.avarageUnitByOrder : selectedDate?.code == 'WEEK' ? orders?.weeklyData?.avarageUnitByOrder : orders?.monthlyData?.avarageUnitByOrder }}
                        </p>
                    </div>
                </div>
                <Chart type="bar" :height="520" :data="chartData" :options="chartOptions"></Chart>
            </div>
        </div>

        <div class="col-12 xl:col-4 p-3">
            <div class="grid">
                <div class="col-12 md:col-6 xl:col-12">
                    <div class="card">
                        <div class="card-header gap-3 pb-2">
                            <div class="card-title">
                                <h6>Waiting Actions</h6>
                                <p class="subtitle">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                            </div>
                        </div>
                        <TabView class="w-full p-0">
                            <TabPanel>
                                <template #header>
                                    <div class="pr-2" v-badge.info="6">
                                        <h6 class="m-0 mr-2">Unshipped Orders</h6>
                                    </div>
                                </template>
                                <ul class="list-none p-0 overflow-auto" style="margin: 0 -1.5rem -1rem; max-height: 17.745rem">
                                    <li class="border-round-lg pt-2 px-3 pb-2 mb-3" style="background-color: var(--primary-lighter-color)">
                                        <div class="flex justify-content-between align-items-center mb-1">
                                            <div class="flex align-items-center gap-1">
                                                <h6 class="line-height-3 m-0 font-medium">Order</h6>
                                                <Tag class="m-0 mr-2 px-2 text-xs bg-blue-300" style="inline-block" value="#05895"></Tag>
                                            </div>

                                            <span class="text-gray-300 font-semibold text-sm line-height-1">4h ago</span>
                                        </div>
                                        <div class="flex justify-content-between align-items-center">
                                            <span class="mt-1 text-400 block text-sm line-height-1"> <b>1</b> Bamboo Watch, <b>3</b> Blue Band, </span>
                                            <Button type="button" icon="pi pi-ellipsis-v" size="small" class="flex-shrink-0" rounded text @click="menu.toggle($event)"></Button>
                                        </div>
                                    </li>
                                    <li class="border-round-lg pt-2 px-3 pb-2 mb-3" style="background-color: var(--primary-lighter-color)">
                                        <div class="flex justify-content-between align-items-center mb-1">
                                            <div class="flex align-items-center gap-1">
                                                <h6 class="line-height-3 m-0 font-medium">Order</h6>
                                                <Tag class="m-0 mr-2 px-2 text-xs bg-blue-300" style="inline-block" value="#05852"></Tag>
                                            </div>

                                            <span class="text-gray-300 font-semibold text-sm line-height-1">6h ago</span>
                                        </div>
                                        <div class="flex justify-content-between align-items-center">
                                            <span class="mt-1 text-400 block text-sm line-height-1"> <b>1</b> Bamboo Watch, <b>3</b> Blue Band, </span>
                                            <Button type="button" icon="pi pi-ellipsis-v" size="small" class="flex-shrink-0" rounded text @click="menu.toggle($event)"></Button>
                                        </div>
                                    </li>
                                    <li class="border-round-lg pt-2 px-3 pb-2 mb-3" style="background-color: var(--primary-lighter-color)">
                                        <div class="flex justify-content-between align-items-center mb-1">
                                            <div class="flex align-items-center gap-1">
                                                <h6 class="line-height-3 m-0 font-medium">Order</h6>
                                                <Tag class="m-0 mr-2 px-2 text-xs bg-blue-300" style="inline-block" value="#05605"></Tag>
                                            </div>

                                            <span class="text-gray-300 font-semibold text-sm line-height-1">1d ago</span>
                                        </div>
                                        <div class="flex justify-content-between align-items-center">
                                            <span class="mt-1 text-400 block text-sm line-height-1"> <b>1</b> Bamboo Watch, <b>3</b> Blue Band, </span>
                                            <Button type="button" icon="pi pi-ellipsis-v" size="small" class="flex-shrink-0" rounded text @click="menu.toggle($event)"></Button>
                                        </div>
                                    </li>
                                    <li class="border-round-lg pt-2 px-3 pb-2 mb-3" style="background-color: var(--primary-lighter-color)">
                                        <div class="flex justify-content-between align-items-center mb-1">
                                            <div class="flex align-items-center gap-1">
                                                <h6 class="line-height-3 m-0 font-medium">Order</h6>
                                                <Tag class="m-0 mr-2 px-2 text-xs bg-blue-300" style="inline-block" value="#05462"></Tag>
                                            </div>

                                            <span class="text-gray-300 font-semibold text-sm line-height-1">1d ago</span>
                                        </div>
                                        <div class="flex justify-content-between align-items-center">
                                            <span class="mt-1 text-400 block text-sm line-height-1"> <b>1</b> Bamboo Watch, <b>3</b> Blue Band, </span>
                                            <Button type="button" icon="pi pi-ellipsis-v" size="small" class="flex-shrink-0" rounded text @click="menu.toggle($event)"></Button>
                                        </div>
                                    </li>
                                    <li class="border-round-lg pt-2 px-3 pb-2 mb-3" style="background-color: var(--primary-lighter-color)">
                                        <div class="flex justify-content-between align-items-center mb-1">
                                            <div class="flex align-items-center gap-1">
                                                <h6 class="line-height-3 m-0 font-medium">Order</h6>
                                                <Tag class="m-0 mr-2 px-2 text-xs bg-blue-300" style="inline-block" value="#05241"></Tag>
                                            </div>

                                            <span class="text-gray-300 font-semibold text-sm line-height-1">1w 2d ago</span>
                                        </div>
                                        <div class="flex justify-content-between align-items-center">
                                            <span class="mt-1 text-400 block text-sm line-height-1"> <b>1</b> Bamboo Watch, <b>3</b> Blue Band, </span>
                                            <Button type="button" icon="pi pi-ellipsis-v" size="small" class="flex-shrink-0" rounded text @click="menu.toggle($event)"></Button>
                                        </div>
                                    </li>
                                    <li class="border-round-lg pt-2 px-3 pb-2 mb-3" style="background-color: var(--primary-lighter-color)">
                                        <div class="flex justify-content-between align-items-center mb-1">
                                            <div class="flex align-items-center gap-1">
                                                <h6 class="line-height-3 m-0 font-medium">Order</h6>
                                                <Tag class="m-0 mr-2 px-2 text-xs bg-blue-300" style="inline-block" value="#05241"></Tag>
                                            </div>

                                            <span class="text-gray-300 font-semibold text-sm line-height-1">1w 2d ago</span>
                                        </div>
                                        <div class="flex justify-content-between align-items-center">
                                            <span class="mt-1 text-400 block text-sm line-height-1"> <b>1</b> Bamboo Watch, <b>3</b> Blue Band, </span>
                                            <Button type="button" icon="pi pi-ellipsis-v" size="small" class="flex-shrink-0" rounded text @click="menu.toggle($event)"></Button>
                                        </div>
                                    </li>
                                </ul>
                                <Menu ref="menu" :popup="true" :model="items"></Menu>
                            </TabPanel>
                            <TabPanel>
                                <template #header>
                                    <div class="pr-2" v-badge.warning="3">
                                        <h6 class="m-0 mr-2">Unreturned Messages</h6>
                                    </div>
                                </template>
                                <ul class="list-none p-0 overflow-auto" style="margin: 0 -1.5rem -1rem; max-height: 17.745rem">
                                    <li class="border-round-lg pt-2 px-3 pb-2 mb-3" style="background-color: var(--primary-lighter-color)">
                                        <div class="flex justify-content-between align-items-center mb-1">
                                            <div class="flex align-items-center gap-1">
                                                <h6 class="line-height-3 m-0 font-medium">Message from <b>Anna K.</b></h6>
                                                <Tag class="m-0 mr-2 px-2 text-xs bg-orange-300" style="inline-block" value="#05895"></Tag>
                                            </div>

                                            <span class="text-gray-300 font-semibold text-sm line-height-1">4h ago</span>
                                        </div>
                                        <div class="flex justify-content-between align-items-center">
                                            <span class="mt-1 text-400 block text-sm line-height-1 white-space-nowrap overflow-hidden text-overflow-ellipsis">
                                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam ad itaque voluptatum deleniti impedit! Inventore eius soluta maxime a quisquam alias, at minima ullam reiciendis blanditiis
                                                voluptate. Dolore, nisi vel.
                                            </span>
                                            <Button type="button" icon="pi pi-ellipsis-v" size="small" class="flex-shrink-0" rounded text @click="menu2.toggle($event)"></Button>
                                        </div>
                                    </li>
                                    <li class="border-round-lg pt-2 px-3 pb-2 mb-3" style="background-color: var(--primary-lighter-color)">
                                        <div class="flex justify-content-between align-items-center mb-1">
                                            <div class="flex align-items-center gap-1">
                                                <h6 class="line-height-3 m-0 font-medium">Message from <b>Daniel F.</b></h6>
                                                <Tag class="m-0 mr-2 px-2 text-xs bg-orange-300" style="inline-block" value="#05895"></Tag>
                                            </div>

                                            <span class="text-gray-300 font-semibold text-sm line-height-1">6h ago</span>
                                        </div>
                                        <div class="flex justify-content-between align-items-center">
                                            <span class="mt-1 text-400 block text-sm line-height-1 white-space-nowrap overflow-hidden text-overflow-ellipsis">
                                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam ad itaque voluptatum deleniti impedit! Inventore eius soluta maxime a quisquam alias, at minima ullam reiciendis blanditiis
                                                voluptate. Dolore, nisi vel.
                                            </span>
                                            <Button type="button" icon="pi pi-ellipsis-v" size="small" class="flex-shrink-0" rounded text @click="menu2.toggle($event)"></Button>
                                        </div>
                                    </li>
                                    <li class="border-round-lg pt-2 px-3 pb-2 mb-3" style="background-color: var(--primary-lighter-color)">
                                        <div class="flex justify-content-between align-items-center mb-1">
                                            <div class="flex align-items-center gap-1">
                                                <h6 class="line-height-3 m-0 font-medium">Message from <b>Judy F.</b></h6>
                                                <Tag class="m-0 mr-2 px-2 text-xs bg-orange-300" style="inline-block" value="#05895"></Tag>
                                            </div>

                                            <span class="text-gray-300 font-semibold text-sm line-height-1">1d ago</span>
                                        </div>
                                        <div class="flex justify-content-between align-items-center">
                                            <span class="mt-1 text-400 block text-sm line-height-1 white-space-nowrap overflow-hidden text-overflow-ellipsis">
                                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam ad itaque voluptatum deleniti impedit! Inventore eius soluta maxime a quisquam alias, at minima ullam reiciendis blanditiis
                                                voluptate. Dolore, nisi vel.
                                            </span>
                                            <Button type="button" icon="pi pi-ellipsis-v" size="small" class="flex-shrink-0" rounded text @click="menu2.toggle($event)"></Button>
                                        </div>
                                    </li>
                                </ul>
                                <Menu ref="menu2" :popup="true" :model="items"></Menu>
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
                <div class="col-12 md:col-6 xl:col-12">
                    <div class="card mt-2">
                        <div class="card-header gap-3 pb-2">
                            <div class="card-title">
                                <h6>Sales By Category</h6>
                                <p class="subtitle">Categorized sales data</p>
                            </div>
                        </div>
                        <div class="flex align-items-center justify-content-between">
                            <ul class="list-none p-0 m-0">
                                <li class="mb-3 flex align-items-center"><i class="pi pi-circle-fill text-primary-300 mr-2"></i><span>Watches</span></li>
                                <li class="mb-3 flex align-items-center"><i class="pi pi-circle-fill text-orange-300 mr-2"></i><span>Clothing</span></li>
                                <li class="mb-3 flex align-items-center"><i class="pi pi-circle-fill text-green-300 mr-2"></i><span>Gadgets</span></li>
                                <li class="mb-3 flex align-items-center"><i class="pi pi-circle-fill text-cyan-300 mr-2"></i><span>Accessories</span></li>
                            </ul>
                            <Chart type="doughnut" :data="pieData" :options="pieOptions" :height="140" :width="140"></Chart>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 xl:col-3 p-3">
            <div class="card overflow-auto">
                <div class="card-header gap-3">
                    <div class="card-title">
                        <h6>Clients</h6>
                        <p class="subtitle">Your Clients Data</p>
                    </div>
                    <p class="subtitle">8 May</p>
                </div>
                <Chart type="line" :data="chart1" :options="chartOptions1" :responsive="true" style="max-height: 160px"></Chart>
                <div class="p-3 border-round-xl my-3 mx-0" style="background-color: var(--primary-lighter-color)">
                    <div class="flex align-items-center b-2">
                        <img src="/demo/images/dashboard/subtract.svg" alt="freya-layout" />
                        <h6 class="my-0 mx-2">Insights</h6>
                    </div>
                    <ul class="list-none p-0 m-0">
                        <li class="flex align-items-center justify-content-between text-gray-300 my-2 mx-0">
                            <span class="font-semibold"><span class="font-normal text-sm">1</span> Client from Mail CTA</span>
                            <span class="p-tag p-tag-warning">12%</span>
                        </li>
                        <li class="flex align-items-center justify-content-between text-gray-300 my-2 mx-0">
                            <span class="font-semibold"><span class="font-normal text-sm">2</span> Clients from FB Ads</span>
                            <span class="p-tag p-tag-success">UP!</span>
                        </li>
                        <a href="#">See all(4)</a>
                    </ul>
                </div>
                <Button type="button" label="Go to Clients Reports" class="w-full" outlined></Button>
            </div>
        </div>
        <div class="col-12 xl:col-9 p-3">
            <div class="card h-full">
                <div class="card-header gap-3">
                    <div class="card-title">
                        <h6>Ad Managment</h6>
                        <p class="subtitle">Your <b>Active</b> Ad's ROI's</p>
                    </div>
                    <div class="inline-flex align-items-center">
                        <IconField iconPosition="left" class="flex-auto">
                            <InputIcon class="pi pi-search" />
                            <InputText type="text" placeholder="Search" v-model="filterSalesTable.global.value" class="w-full" style="border-radius: 2rem" />
                        </IconField>
                        <Button icon="pi pi-upload" class="mx-3" rounded @click="dt.exportCSV()"></Button>
                    </div>
                </div>
                <DataTable :value="activeAds" :rows="3" :paginator="true" v-model:filters="filterSalesTable" v-model:expandedRows="expandedRows" :tableStyle="{ minWidth: '60rem' }">
                    <Column expander style="width: 3rem" />
                    <Column field="name" header="Name" class="px-1" :sortable="true" style="width: 50%" />
                    <Column header="">
                        <template #body="slotProps">
                            <img :src="slotProps.data.image" :alt="slotProps.data.name" height="60" class="border-round" />
                        </template>
                    </Column>
                    <Column field="adROI" header="Ad ROI" :sortable="true" headerClass="px-1 py-2 text-right " />
                    <Column field="adCTR" header="Ad CTR" :sortable="true" headerClass="px-1 py-2 text-right" />
                    <template #expansion="slotProps">
                        <div class="flex">
                            <img :src="slotProps?.data?.image" :alt="slotProps?.data?.name" height="160" class="border-round" />
                            <div class="ml-3 w-8">
                                <div class="p-3">
                                    <h4 class="font-medium m-0 mb-2">{{ slotProps?.data?.name }}</h4>
                                    <p class="p-0 m-0">{{ slotProps?.data?.adDesc }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 mb-3">
                            <DataTable :value="slotProps?.data?.detailedData">
                                <Column field="name" header="Name" />
                                <Column field="adROI" header="ROI" headerClass="white-space-nowrap text-right" />
                                <Column field="adCTR" header="CTR" headerClass="white-space-nowrap text-right" />
                                <Column field="adCR" header="CR" headerClass="white-space-nowrap text-right" />
                                <Column field="adCPA" header="CPA" headerClass="white-space-nowrap text-right" />
                                <Column field="adCPC" header="CPC" headerClass="white-space-nowrap text-right" />
                                <Column field="impressions" header="Imp." headerClass="white-space-nowrap text-right" />
                                <Column field="clicks" header="Clicks" headerClass="white-space-nowrap text-right" />
                            </DataTable>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>
    </div>
</template>
