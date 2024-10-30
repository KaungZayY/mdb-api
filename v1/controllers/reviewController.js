import { Review } from '../../models/Review.js'
import { Movie } from '../../models/Movie.js'

async function createReview(req, res) {
    try {
        const { id } = req.params;
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).send({ message: 'Movie not found!' });
        }

        if (
            !req.body.rating ||
            !req.body.review
        ) {
            return res.status(400).send({
                message: 'Required rating and review'
            });
        }

        const newReview = {
            author_id: req.user.userId,
            movie_id: movie.id,
            rating: req.body.rating,
            review: req.body.review
        }

        const review = await Review.create(newReview);
        return res.status(201).send(review);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
}

async function getAllReviews(req, res) {
    let page = req.query.page;
    let limit = req.query.limit;
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) {
        return res.status(404).send({ message: 'Movie not found!' });
    }
    try {
        const reviews = await Review.find({ movie_id: movie.id })
            .populate({ path: 'author_id', select: 'name' })
            .populate({ path: 'movie_id', select: 'title' })
            .limit(limit)
            .skip(page * limit)
            .sort({
                createdAt: 'desc'
            });
        return res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
}

async function updateReviewById(req, res){
    try{
        const { id } = req.params;
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).send({ message: 'Review not found!' });
        }

        const owner = isOwner(req, review);
        if(!owner){
            return res.status(401).send({ message: 'Unauthorized Access!' });
        }

        if (
            !req.body.rating ||
            !req.body.review
        ) {
            return res.status(400).send({
                message: 'Required rating and review'
            });
        }

        const result = await Review.findByIdAndUpdate(id, req.body);
        
        if(!result){
            return res.status(404).send({message: 'Review not found!'});
        }
        return res.status(200).send({message: 'Review updated!'});
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
}

async function deleteReviewById(req, res){
    try{
        const { id } = req.params;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).send({ message: 'Review not found!' });
        }

        const owner = isOwner(req, review);
        if(!owner){
            return res.status(401).send({ message: 'Unauthorized Access!' });
        }

        const result = await Review.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).send({ message: 'Review not found!' });
        }
        
        return res.status(200).send({ message: 'Review deleted!' });
    
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
}

function isOwner(req, review){
    return req.user.userId.toString() === review.author_id.toString();
}

export default { createReview, getAllReviews, updateReviewById, deleteReviewById };
