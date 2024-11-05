import {expect, jest, test} from '@jest/globals';
import { Review } from '../../../models/Review.js';
import reviewController from '../../../v1/controllers/reviewController';
import { Movie } from '../../../models/Movie.js';


jest.mock('../../../models/Review.js');
jest.mock('../../../models/Movie.js');

describe('Review Controller', () => {
    let req;
    let res;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createReview', () => {
        test('should create a review and return it', async () => {
            req = {
                params: { id: "x0123456789" },
                body: { rating: 5, review: 'Great movie!' },
                user: { userId: "Ux0123" }
            };

            const mockMovie = { id: req.params.id };
            const mockReview = { ...req.body, author_id: req.user.userId, movie_id: req.params.id };

            Movie.findById = jest.fn().mockResolvedValue(mockMovie);
            Review.create = jest.fn().mockResolvedValue(mockReview);

            await reviewController.createReview(req, res);

            expect(Movie.findById).toHaveBeenCalledWith(req.params.id);
            expect(Review.create).toHaveBeenCalledWith(mockReview);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith(mockReview);
        });

        test('should return 400 if required fields are missing', async () => {
            req = {
                params: { id: "x0123456789" },
                body: {},
                user: { userId: "Ux0123" }
            };
            const mockMovie = { id: req.params.id };
            Movie.findById = jest.fn().mockResolvedValue(mockMovie);

            await reviewController.createReview(req, res);

            expect(Movie.findById).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({message: 'Required rating and review'});
        });

        test('should return 404 if requested movie is not found', async () => {
            req = {
                params: { id: "x0123456789" },
            };
            Movie.findById = jest.fn().mockResolvedValue(null);

            await reviewController.createReview(req, res);

            expect(Movie.findById).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({message: 'Movie not found!'});
        });
    });

    describe('getAllReviews', () => {
        test('should return a paginated list of reviews', async () => {
            req = {
                query: {
                    page: 0,
                    limit: 2,
                },
                params: { id: "x0123456789" },
            };

            const mockReviews = [
                {
                    author_id: "Ux0123",
                    movie_id: "x0123456789",
                    rating: 4,
                    review: "Good Movie"
                },
                {
                    author_id: "Ux0124",
                    movie_id: "x0123456789",
                    rating: 3,
                    review: "Not Bad"
                },
            ]
            const mockMovie = { id: req.params.id };
            Movie.findById = jest.fn().mockResolvedValue(mockMovie);
            
            Review.find = jest.fn(() => ({
                populate: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnValue(mockReviews),
            }));
            

            await reviewController.getAllReviews(req, res);

            expect(Movie.findById).toHaveBeenCalled();
            expect(Review.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(mockReviews);
        });

        test('should return 404 if requested movie is not found', async () => {
            req = {
                query: {
                    page: 0,
                    limit: 2,
                },
                params: { id: "x0123456789" },
            };
            Movie.findById = jest.fn().mockResolvedValue(null);

            await reviewController.getAllReviews(req, res);

            expect(Movie.findById).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({message: 'Movie not found!'});
        });
    });

    describe('updateReviewById', () => {
        test('should return 404 if the requested review is not found', async () => {
            req = {
                params: { id: "Rx0123456"}
            };
            Review.findById = jest.fn().mockResolvedValue(null);

            await reviewController.updateReviewById(req, res);

            expect(Review.findById).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({message: 'Review not found!'});
        });

        test('should return 401 if the user is not the owner of the review', async () => {
            req = {
                params: { id: "Rx0123456"},
                user: { userId: "Ux0124" }
            };

            const mockReview = {
                    author_id: "Ux0123",
                    movie_id: "x0123456789",
                    rating: 4,
                    review: "Good Movie"
            }
            Review.findById = jest.fn().mockResolvedValue(mockReview);

            await reviewController.updateReviewById(req, res);

            expect(Review.findById).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith({message: 'Unauthorized Access!'});
        });

        test('should update the review info', async () => {
            req = {
                params: { id: "Rx0123456"},
                user: { userId: "Ux0124" },
                body: {
                    author_id: "Ux0124",
                    movie_id: "x0123456789",
                    rating: 5,
                    review: "Updated Review"
                }
            };

            const mockReview = {
                    author_id: "Ux0124",
                    movie_id: "x0123456789",
                    rating: 4,
                    review: "Good Movie"
            }
            Review.findById = jest.fn().mockResolvedValue(mockReview);
            Review.findByIdAndUpdate = jest.fn().mockResolvedValue(req);

            await reviewController.updateReviewById(req, res);

            expect(Review.findById).toHaveBeenCalled();
            expect(Review.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({message: 'Review updated!'});
        });
    });

    describe('deleteReviewById', () => {
        test('should return 404 if the requested review is not found', async () => {
            req = {
                params: { id: "Rx0123456"}
            };
            Review.findById = jest.fn().mockResolvedValue(null);

            await reviewController.deleteReviewById(req, res);

            expect(Review.findById).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({message: 'Review not found!'});
        });

        test('should return 401 if the user is not the owner of the review', async () => {
            req = {
                params: { id: "Rx0123456"},
                user: { userId: "Ux0124" }
            };

            const mockReview = {
                author_id: "Ux0123"
            }
            Review.findById = jest.fn().mockResolvedValue(mockReview);

            await reviewController.deleteReviewById(req, res);

            expect(Review.findById).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith({message: 'Unauthorized Access!'});
        });

        test('should delete the review', async () => {
            req = {
                params: { id: "Rx0123456"},
                user: { userId: "Ux0124" }
            };

            const mockReview = {
                author_id: "Ux0124"
            }
            Review.findById = jest.fn().mockResolvedValue(mockReview);
            Review.findByIdAndDelete = jest.fn().mockResolvedValue(req.params.id);

            await reviewController.deleteReviewById(req, res);

            expect(Review.findById).toHaveBeenCalled();
            expect(Review.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({message: 'Review deleted!'});
        });
    });
});