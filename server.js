require('dotenv').config()
const express = require('express') // CJS
const path = require('node:path')
const { connectDB } = require('./src/config/db')

// Importar modelos
require('./src/models/index')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

async function startServer () {
  try {
    await connectDB()

    const authRoutes = require('./src/routes/auth.routes.js')

    const { obtenerServicios, crearServicio, actualizarServicio, eliminarServicio } = require('./src/controllers/service.controller.js')

    console.log('🌐 Conectado a la base de datos y modelos sincronizados')

    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'))
    })

    app.get('/login', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'login.html'))
    })

    app.get('/registro', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'registro.html'))
    })

    app.get('/dashboard', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'dashboard.html'))
    })

    // Usar rutas de auth
    app.use('/api/auth/', authRoutes)

    app.get('/api/services/publicos', obtenerServicios)
    app.get('/api/services', obtenerServicios)
    app.post('/api/services', crearServicio)
    app.put('/api/services/:id', actualizarServicio)
    app.delete('/api/services/:id', eliminarServicio)

    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error)
  }
}

startServer()
