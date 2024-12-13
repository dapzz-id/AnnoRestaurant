import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../../App'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import './totalpenjualan.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const TotalPenjualan = () => {
  const [orderSummary, setOrderSummary] = useState({})

  useEffect(() => {
    fetchCompletedOrders()
  }, [])

  const fetchCompletedOrders = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/order/completed`)
      const completedOrders = response.data.data
      calculateOrderSummary(completedOrders)
    } catch (error) {
      console.error('Gagal mengambil data pesanan selesai:', error)
    }
  }

  const calculateOrderSummary = (orders) => {
    const summary = orders.reduce((acc, order) => {
      order.items.forEach(item => {
        if (acc[item.name]) {
          acc[item.name] += item.quantity
        } else {
          acc[item.name] = item.quantity
        }
      })
      return acc
    }, {})
    
    // Mengurutkan summary dari yang tertinggi ke terendah
    const sortedSummary = Object.entries(summary)
      .sort(([,a], [,b]) => b - a)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
    
    setOrderSummary(sortedSummary)
  }

  const data = {
    labels: Object.keys(orderSummary),
    datasets: [
      {
        label: 'Jumlah Terjual',
        data: Object.values(orderSummary),
        backgroundColor: Object.keys(orderSummary).map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.8)`),
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Semua Makanan yang Pernah Dibeli',
        font: {
          size: 20,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Terjual: ${context.parsed.x} porsi`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Jumlah Porsi Terjual',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          precision: 0
        }
      },
      y: {
        title: {
          display: true,
          text: 'Nama Makanan',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    }
  }

  return (
    <div className="total-penjualan-container">
      <h2 className="total-penjualan-title">Statistik Penjualan Semua Makanan</h2>
      <div className="chart-container" style={{ height: `${Object.keys(orderSummary).length * 30 + 200}px` }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}

export default TotalPenjualan
