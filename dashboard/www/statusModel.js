let SidebarMenu = window["vue-sidebar-menu"].SidebarMenu;


$(document).ready(function()
{
  console.log('On ready...')

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
      menu: menuValues,
      collapsed:false,
      selectedTheme:"white-theme"
    }
  });

  var blueclients = [];
  let bluestatusBars = new Vue({
    el: "#blueStatusColors",
    data: function data(){
        return {clients: blueclients};
    }
  });

  var greenclients = [];
  let greenstatusBars = new Vue({
    el: "#greenStatusColors",
    data: function data(){
        return {clients: greenclients};
    }
  });

  linechart();
  // let greenData = [0];
  // let blueData = [0];
  let vm2 = new Vue({
    el: '.chart',
    data: {
      blueChartData: [{x: new Date(), y: 0}],
      greenChartData: [{x: new Date(), y: 0}],
    },  
  });
  // var chart = vm2.$refs.linechart;
  // console.log(chart)

  const host = `${window.location.hostname}:3050`;
  console.log(`Connecting to ${host}`);
  var socket = io.connect(host, {
      upgrade: false,
      transports: ['websocket']
  });
  
 

  socket.on("heartbeat", function(heartbeat) 
  {
      // console.log(JSON.stringify(heartbeat));

      for( var server of heartbeat )
      {
        if( server.name == "blue")
        {
          bluestatusBars.clients = server.stat;

          let sum = 0;
          for ( var container of server.stat )
          {
            sum+=parseFloat(container.CPUPerc);
          }
          // console.log(sum);
          vm2.blueChartData.push( {x: new Date(), y: sum / 3.0});
        }
        else{
          greenstatusBars.clients = server.stat;

          let sum = 0;
          for ( var container of server.stat )
          {
            sum+=parseFloat(container.CPUPerc);
          }
          // console.log(sum);

          vm2.greenChartData.push( {x: new Date(), y: sum / 3.0});
        }
      }

      // vm2.greenChartData = greenData;
      // vm2.blueChartData = blueData;

      //console.log(greenData);
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

function linechart()
{
  const START=1, END=100;
  let labels = Array.from({length: END-START}, (x, i) => i+START);

  return Vue.component('line-chart', {
    extends: VueChartJs.Line,
    props: ["bluedata", "greendata"],
    computed: {
      greenChartData: function() {
        return this.greendata;
      },
      blueChartData: function() {
        return this.bluedata;
      }
    },
    mounted () {
      console.log('mounted...');
      this.renderLineChart();
    },
    methods: {
      renderLineChart: function() {
        this.renderChart({
          labels: labels,
          datasets: [
            {
              label: 'Control (Blue)',
              borderColor: 'rgba(50, 115, 220, 0.5)',
              backgroundColor: 'rgba(50, 115, 220, 0.1)',
              data: this.blueChartData,
            },
            {
              label: 'Canary (Green)',
              borderColor: 'rgba(96, 220, 56, 0.5)',
              backgroundColor: 'rgba(96, 220, 56, 0.1)',
              data: this.greenChartData,
            }
          ]
        }, {responsive: true, maintainAspectRatio: false})  
      }
    }, 
    watch: {
      bluedata: function() {
        // this._chart.destroy();
        //this.renderChart(this.data, this.options);
        this.renderLineChart();
      },
      greendata: function() {
        // this._chart.destroy();
        //this.renderChart(this.data, this.options);
        this.renderLineChart();
      }
    }
  })  
}

function menu()
{
  return Vue.component('sidebar-menu', {
    extends: SidebarMenu 
  });
}
