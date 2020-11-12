$(function() {
  'use strict';



      var newCust2 = [[0, 10], [1, 7], [2, 8], [3, 9], [4, 6], [5, 23], [6, 20]];
      var retCust2 = [[0, 8], [1, 5], [2, 6], [3, 8], [4, 4], [5, 29], [6,25]];

      var plot = $.plot($('#flotLine3'),[
        {
          data: newCust2,
          label: 'Rank on Google',
          color: '#F37AAD'
        },
        {
          data: retCust2,
          label: 'Rank on Bing',
          color: '#6AC3C9'
        }],
        {
          series: {
            lines: {
              show: true,
              lineWidth: 1
            },
            shadowSize: 0
          },
          points: {
            show: true,
          },
          legend: {
            noColumns: 1,
            position: 'nw'
          },
          grid: {
            hoverable: true,
            clickable: true,
            borderColor: '#ddd',
            borderWidth: 0,
            labelMargin: 5,
            backgroundColor: '#fff'
          },
          yaxis: {
            min: 0,
            max: 35,
            color: '#eee',
            font: {
              size: 10,
              color: '#999'
            }
          },
          xaxis: {
            color: '#eee',
            font: {
              size: 10,
              color: '#999'
            }
          }
        });

    


    var previousPoint = null;

    $('#flotLine3').bind('plothover', function (event, pos, item) {
      $('#x').text(pos.x.toFixed(2));
      $('#y').text(pos.y.toFixed(2));

      if(item) {
        if (previousPoint != item.dataIndex) {
          previousPoint = item.dataIndex;

          $('#tooltip').remove();
          var x = item.datapoint[0].toFixed(2),
          y = item.datapoint[1].toFixed(2);

          showTooltip(item.pageX, item.pageY, item.series.label + ' of ' + x + ' = ' + y);
        }
      } else {

        $('#tooltip').remove();
        previousPoint = null;
      }
    });

    $('#flotLine3').bind('plotclick', function (event, pos, item) {
      if (item) {
        plot.highlight(item.series, item.datapoint);
      }
    });

    function showTooltip(x, y, contents) {
  		$('<div id="tooltip" class="tooltipflot">' + contents + '</div>').css( {
  		  position: 'absolute',
  		  display: 'none',
  		  top: y + 5,
  		  left: x + 5
  		}).appendTo('body').fadeIn(200);
  	}



});
