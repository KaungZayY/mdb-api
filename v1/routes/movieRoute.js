import express from 'express';
import movieContrller from '../controllers/movieController.js'

const router = express.Router();

/* API Route: /api/v1/movies
** Method: POST
** params: title, studio, runningtime, genre(optional), diretor, year */
router.post('/', async (req, res) => {
    await movieContrller.createMovie(req, res);
});

/* API Route: /api/v1/movies
** Method: GET
** params: /?page=0&limit=0(optional) */
router.get('/', async (req, res) => {
    await movieContrller.getAllMovies(req, res);
});

/* API Route: /api/v1/movies/:id
** Method: GET
** params: id */
router.get('/:id', async (req, res) => {
    await movieContrller.getMovieById(req, res);
});

/* API Route: /api/v1/movies/:id
** Method: PUT
** params: id, title, studio, runningtime, genre(optional), diretor, year */
router.put('/:id', async (req, res) => {
    await movieContrller.updateMovieById(req, res);
});

/* API Route: /api/v1/movies/:id
** Method: DELETE
** params: id */
router.delete('/:id', async (req, res) => {
    await movieContrller.deleteMovieById(req, res);
});

export default router;