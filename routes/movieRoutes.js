import express from 'express'
import { auth, authAdmin } from '../middleware/auth.js'
import { getMovies, getMovieById, createNewMovie, updateMovie, deleteMovie } from '../controller/movieController.js'

const router = express.Router()

router.get('/', auth, getMovies)
router.get('/:id', auth, getMovieById)
router.post('/', auth, authAdmin, createNewMovie)
router.put('/:id', auth, authAdmin, updateMovie)
router.delete('/:id',auth, authAdmin, deleteMovie)

export { router as movieRoutes }