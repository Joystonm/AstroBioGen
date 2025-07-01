import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const GeneChart = ({ geneData, chartType = 'bar' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Clean up any existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (!geneData || geneData.length === 0) return;

    // Prepare data for the chart
    const topGenes = geneData.slice(0, 10); // Show top 10 genes
    
    const labels = topGenes.map(gene => gene.gene_symbol);
    const foldChanges = topGenes.map(gene => gene.fold_change);
    
    // Set colors based on fold change (red for upregulated, green for downregulated)
    const backgroundColors = foldChanges.map(value => 
      value > 0 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(34, 197, 94, 0.7)'
    );
    
    const borderColors = foldChanges.map(value => 
      value > 0 ? 'rgb(220, 38, 38)' : 'rgb(22, 163, 74)'
    );

    // Create the chart
    const ctx = chartRef.current.getContext('2d');
    
    if (chartType === 'bar') {
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Fold Change',
            data: foldChanges,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                afterLabel: function(context) {
                  const index = context.dataIndex;
                  const gene = topGenes[index];
                  return [
                    `Gene: ${gene.gene_name}`,
                    `p-value: ${gene.p_value}`,
                    `Function: ${gene.function}`
                  ];
                }
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Fold Change'
              },
              grid: {
                color: 'rgba(107, 114, 128, 0.1)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Gene Symbol'
              },
              grid: {
                display: false
              }
            }
          }
        }
      });
    } else if (chartType === 'scatter') {
      // Create a scatter plot of fold change vs p-value
      chartInstance.current = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Gene Expression',
            data: topGenes.map(gene => ({
              x: gene.fold_change,
              y: -Math.log10(gene.p_value), // -log10(p-value) for better visualization
              gene: gene.gene_symbol,
              name: gene.gene_name,
              function: gene.function
            })),
            backgroundColor: topGenes.map(gene => 
              gene.fold_change > 0 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(34, 197, 94, 0.7)'
            ),
            borderColor: topGenes.map(gene => 
              gene.fold_change > 0 ? 'rgb(220, 38, 38)' : 'rgb(22, 163, 74)'
            ),
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  const point = context.raw;
                  return [
                    `Gene: ${point.gene} (${point.name})`,
                    `Fold Change: ${point.x.toFixed(2)}`,
                    `p-value: ${Math.pow(10, -point.y).toExponential(2)}`,
                    `Function: ${point.function}`
                  ];
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Fold Change'
              },
              grid: {
                color: 'rgba(107, 114, 128, 0.1)'
              }
            },
            y: {
              title: {
                display: true,
                text: '-log10(p-value)'
              },
              grid: {
                color: 'rgba(107, 114, 128, 0.1)'
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [geneData, chartType]);

  return (
    <div className="w-full h-96 bg-white rounded-lg shadow-md p-4">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default GeneChart;
