let SidebarMenu = window["vue-sidebar-menu"].SidebarMenu;

$(document).ready(function()
{
  console.log('On ready...')

  linechart();
  menu();

  let vm = new Vue({
    el: '.bar',
    methods: {
      onCollapse (collapsed) {
        console.log(collapsed)
        this.collapsed = collapsed
      },
      onItemClick (event, item) {
        console.log('onItemClick')
        // console.log(event)
        // console.log(item)
      }
    },  
    data: {
      foo: "hello",
      menu: menuValues,
      collapsed:false,
      selectedTheme:"white-theme"
    }
  });

  let vm2 = new Vue({
    el: '.chart',
    data: {
      foo: "hello",
    }
  });


});

const menuValues = [
  {
      header: true,
      title: 'Main Navigation',
      hiddenOnCollapse: true
  },
  {
      href: '/',
      title: 'Dashboard',
      icon: 'fa fa-chart-area'
  },
  {
      href: '/#cpu',
      title: 'CPU Load',
      icon: 'fa fa-microchip',
  }
];

// Key the datasets by year for easy access.
const datasets = [
  {
    label: '2018 Sales',
    borderColor: 'rgba(50, 115, 220, 0.5)',
    backgroundColor: 'rgba(50, 115, 220, 0.1)',
    data: [300, 700, 450, 750, 450]
  },
  {
    label: '2017 Sales',
    borderColor: 'rgba(255, 56, 96, 0.5)',
    backgroundColor: 'rgba(255, 56, 96, 0.1)',
    data: [600, 550, 750, 250, 700]
  }
];

function linechart()
{
  Vue.component('line-chart', {
    extends: VueChartJs.Line,
    mounted () {
      console.log('mounted...');
      this.renderChart({
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: datasets
      }, {responsive: true, maintainAspectRatio: false})
    }
  })  
}

function menu()
{
  Vue.component('sidebar-menu', {
    extends: SidebarMenu 
  });
}
