function handleFileUpload(files) {
    // Handle file upload here, e.g., send the file to the server via AJAX
    console.log("File selected:", files[0]);
    // Automatically submit the file
    submitFile(files[0]);
}




document.addEventListener('DOMContentLoaded', function() {
    fetch('/get_counts')
        .then(response => response.json())
        .then(data => {
            const {
                tcp_count,
                udp_count,
                icmp_count,
                arp_count,
                dns_count,
            } = data;
            const barChartOptions = {
                series: [
                {
                    data: [tcp_count, udp_count, icmp_count, arp_count, dns_count],
                    name: 'Protocol Distribution',
                },
                ],
                chart: {
                type: 'bar',
                background: 'transparent',
                height: 350,
                toolbar: {
                    show: false,
                },
                },
                colors: ['#d50000', '#d50000', '#d50000', '#d50000', '#d50000'],
                plotOptions: {
                bar: {
                    distributed: true,
                    borderRadius: 4,
                    horizontal: false,
                    columnWidth: '40%',
                },
                },
                dataLabels: {
                enabled: false,
                },
                fill: {
                opacity: 1,
                },
                grid: {
                borderColor: '#55596e',
                yaxis: {
                    lines: {
                    show: true,
                    },
                },
                xaxis: {
                    lines: {
                    show: true,
                    },
                },
                },
                legend: {
                labels: {
                    colors: '#f5f7ff',
                },
                show: true,
                position: 'top',
                },
                stroke: {
                colors: ['transparent'],
                show: true,
                width: 2,
                },
                tooltip: {
                shared: true,
                intersect: false,
                theme: 'dark',
                },
                xaxis: {
                categories: ['TDP', 'UDP', 'ICMP', 'ARP', 'DNS'],
                title: {
                    style: {
                    color: '#f5f7ff',
                    },
                },
                axisBorder: {
                    show: true,
                    color: '#55596e',
                },
                axisTicks: {
                    show: true,
                    color: '#55596e',
                },
                labels: {
                    style: {
                    colors: '#f5f7ff',
                    },
                },
                },
                yaxis: {
                title: {
                    text: 'Count',
                    style: {
                    color: '#f5f7ff',
                    },
                },
                axisBorder: {
                    color: '#55596e',
                    show: true,
                },
                axisTicks: {
                    color: '#55596e',
                    show: true,
                },
                labels: {
                    style: {
                    colors: '#f5f7ff',
                    },
                },
                },
            };
            
            const barChart = new ApexCharts(
                document.querySelector('#bar-chart'),
                barChartOptions
            );
            barChart.render();
        });
    });
  
// AREA CHART
document.addEventListener('DOMContentLoaded', function() {
    fetch('/get_packet')
        .then(response => response.json())
        .then(data => {
            const timestamps = Object.keys(data);
            const counts = Object.values(data);
            const areaChartOptions = {
                series: [
                {
                    name: 'Packet Counts',
                    data: counts,
                },
                ],
                chart: {
                type: 'area',
                background: 'transparent',
                height: 350,
                stacked: false,
                toolbar: {
                    show: false,
                },
                },
                colors: ['#d50000'],
                labels: timestamps,
                dataLabels: {
                enabled: false,
                },
                fill: {
                gradient: {
                    opacityFrom: 0.4,
                    opacityTo: 0.1,
                    shadeIntensity: 1,
                    stops: [0, 100],
                    type: 'vertical',
                },
                type: 'gradient',
                },
                grid: {
                borderColor: '#55596e',
                yaxis: {
                    lines: {
                    show: true,
                    },
                },
                xaxis: {
                    lines: {
                    show: true,
                    },
                },
                },
                legend: {
                labels: {
                    colors: '#f5f7ff',
                },
                show: true,
                position: 'top',
                },
                markers: {
                size: 6,
                strokeColors: '#1b2635',
                strokeWidth: 3,
                },
                stroke: {
                curve: 'smooth',
                },
                xaxis: {
                axisBorder: {
                    color: '#55596e',
                    show: true,
                },
                axisTicks: {
                    color: '#55596e',
                    show: true,
                },
                labels: {
                    offsetY: 5,
                    style: {
                    colors: '#f5f7ff',
                    },
                },
                },
                yaxis: {
                title: {
                    text: 'Packet Counts',
                    style: {
                        color: '#f5f7ff',
                    },
                },
                labels: {
                    style: {
                        colors: ['#f5f7ff'],
                    },
                },
                },
                tooltip: {
                shared: true,
                intersect: false,
                theme: 'dark',
                },
            };
            
            const areaChart = new ApexCharts(
                document.querySelector('#area-chart'),
                areaChartOptions
            );
            areaChart.render();
        });
    });