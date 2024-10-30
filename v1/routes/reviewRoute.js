import express from 'express';
import reviewController from '../controllers/reviewController.js';
import authV1 from '../middlewares/auth.js';


const router = express.Router();

/* API Route: /api/v1/movies/:id/reviews
** Method: GET
** param: movie_id */
router.get('/:id/reviews', async (req, res) => {
    await reviewController.getAllReviews(req, res);
});

/* API Route: /api/v1/movies/:id/reviews
** Method: POST
** body: rating, review */
router.post('/:id/reviews', authV1.validateToken, async (req, res) => {
    await reviewController.createReview(req, res);
});

/* API Route: /api/v1/movies/reviews/:id
** Method: POST
** body: rating, review */
router.put('/reviews/:id', authV1.validateToken, async (req, res) => {
    await reviewController.updateReviewById(req, res);
});

/* API Route: /api/v1/movies/reviews/:id
** Method: DELETE */
router.delete('/reviews/:id', authV1.validateToken, async (req, res) => {
    await reviewController.deleteReviewById(req, res);
});

export default router;