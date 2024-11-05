import {expect, jest, test} from '@jest/globals';
import movieController from "../../../v1/controllers/movieController.js";
import { Movie } from '../../../models/Movie.js';

jest.mock('../../../models/Movie.js');

describe('Movie Controller', () => {

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

    describe('createMovie', () => {
        test('should create a movie when all required fields present and return new movie', async () => {
            req = {
                body: {
                    title: 'Inception',
                    imageUrl: 'http://example.com/inception.jpg',
                    studio: 'Warner Bros',
                    runningtime: 148,
                    diretor: 'Christopher Nolan',
                    year: 2010,
                    genre: 'Sci-Fi',
                },
            };

            const mockMovie = { ...req.body, _id:'x0123456789'};

            Movie.create = jest.fn().mockResolvedValue(mockMovie);

            await movieController.createMovie(req, res);

            expect(Movie.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith(mockMovie);
        });

        test('should return 400 if required fields are missing', async () => {
            req = {
                body: {}
            };

            await movieController.createMovie(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({message: 'Required fields: title, imageUrl, studio, runningtime, diretor, year'});
        });
    })

    describe('getAllMovies', () => {
        test('should return a paginated list of movies', async () => {
            req = {
                query: {
                    page: 0,
                    limit: 2,
                }
            };

            const mockMovies = [
                {
                    title: "Call of the Wind",
                    imageUrl: "www.example.image.png",
                    studio: "A studio",
                    runningtime: 120,
                    diretor: "Mr Diretor",
                    year: 2000
                },
                {
                    title: "Terminator",
                    imageUrl: "www.example.image.png",
                    studio: "B studio",
                    runningtime: 120,
                    diretor: "Mr Diretor",
                    year: 2000
                },
            ]

            Movie.find = jest.fn(() => ({
                limit: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnValue(mockMovies),
            }));

            await movieController.getAllMovies(req, res);

            expect(Movie.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(mockMovies);
        });
    });

    describe('getMovieById', () => {
        test('should return a movie based on ID', async () => {
            req = {
                params: {
                    id: 'x123456789'
                }
            };

            const mockMovie = {
                    title: "Call of the Wind",
                    imageUrl: "www.example.image.png",
                    studio: "A studio",
                    runningtime: 120,
                    diretor: "Mr Diretor",
                    year: 2000
            };

            Movie.findById = jest.fn().mockResolvedValue(mockMovie);

            await movieController.getMovieById(req, res);

            expect(Movie.findById).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(mockMovie);
        });

        test('should return 404 if the movie does not exists', async () =>{
            req = {
                params: {
                    id: 'x123456789'
                }
            };

            Movie.findById = jest.fn().mockResolvedValue(null);

            await movieController.getMovieById(req, res);

            expect(Movie.findById).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith( {message: 'Movie not found!'} );
        });
    });

    describe('getMovieByGenre', () => {
        test('should return a movies based on genre', async () => {
            req = {
                params: {
                    genre: ['War','Action']
                }
            };

            const mockMovies = [
                {
                    id: "x123456789",
                    title: "Call of the Wind",
                    imageUrl: "www.example.image.png",
                    studio: "A studio",
                    runningtime: 120,
                    diretor: "Mr Diretor",
                    year: 2000,
                    genre: ['War', 'Action', 'Revenge']
                },
                {
                    id: "x123456788",
                    title: "Terminator",
                    imageUrl: "www.example.image.png",
                    studio: "B studio",
                    runningtime: 120,
                    diretor: "Mr Diretor",
                    year: 2000,
                    genre: ['War', 'Action', 'Horror']
                },
            ]

            Movie.find = jest.fn().mockResolvedValue(mockMovies);

            await movieController.getMoviesByGenre(req, res);

            expect(Movie.find).toHaveBeenCalledWith(req.params);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(mockMovies);
        });

        test('should return 400 if the required field genre is missing ', async () =>{
            req = {
                params: {
                    genre: ''
                }
            };

            await movieController.getMoviesByGenre(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith( { message: 'Genre parameter is required' } );
        });

        test('should return 404 if the movies with genre do not exists ', async () =>{
            req = {
                params: {
                    genre: ['War','Action']
                }
            };

            const mockMovies = ''

            Movie.find = jest.fn().mockResolvedValue(mockMovies);

            await movieController.getMoviesByGenre(req, res);

            expect(Movie.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith( { message: `No movies found in the '${req.params.genre}' genre` } );
        });
    });

    describe('updateMovieById' , () => {
        test('should update a movie info for given id with status code 200', async () => {
            req = {
                params: {
                    id: "x123456789"
                },
                body: {
                    title: "Updated Title",
                    studio: "Studio M",
                    runningtime: 120,
                    diretor: "Mr. Nobody",
                    year: 2000
                }
            };

            Movie.findByIdAndUpdate = jest.fn().mockResolvedValue(req);

            await movieController.updateMovieById(req, res);

            expect(Movie.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({message: 'Movie info updated!'});
        });

        test('should return 404 not found if the movie with given id does not exists', async () => {
            req = {
                params: {
                    id: "x123456789"
                },
                body: {
                    title: "Updated Title",
                    studio: "Studio M",
                    runningtime: 120,
                    diretor: "Mr. Nobody",
                    year: 2000
                }
            };

            Movie.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

            await movieController.updateMovieById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({message: 'Movie not found!'});
        });
    });

    describe('deleteMovieById', () => {
        test('should update a movie info for given id with status code 200', async () => {
            req = {
                params: {
                    id: "x123456789"
                }
            };

            Movie.findByIdAndDelete = jest.fn().mockResolvedValue(req.params.id);

            await movieController.deleteMovieById(req, res);

            expect(Movie.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ message: 'Movie deleted!' });
        });

        test('should return 404 not found if the movie with given id does not exists to delete', async () => {
            req = {
                params: {
                    id: "x123456789"
                }
            };

            Movie.findByIdAndDelete = jest.fn().mockResolvedValue(null);

            await movieController.deleteMovieById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({message: 'Movie not found!'});
        });
    });

    describe('uploadImage', () => {
        test('should return 201 and the file path if file is uploaded successfully', async () => {
            const mockFilePath = '/uploads/test-image.jpg';
            req = {
                file: {
                    path: mockFilePath
                }
            };

            await movieController.uploadImage(req, res);
    
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({
                message: 'File uploaded successfully!',
                imageUrl: mockFilePath,
            });
        });

        test('should return 400 if no file is uploaded', async () => {
            req = {
                file: null
            };

            await movieController.uploadImage(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                message: `No file uploaded, upload as form-data and key as 'image'`,
            });
        });
    });
})