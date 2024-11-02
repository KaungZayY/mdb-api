import { Movie } from '../../models/Movie.js'

async function createMovie(req, res) {
    try {
        if (
            !req.body.title ||
            !req.body.imageUrl ||
            !req.body.studio ||
            !req.body.runningtime ||
            !req.body.diretor ||
            !req.body.year
        ) {
            return res.status(400).send({
                message: 'Required fields: title, imageUrl, studio, runningtime, diretor, year'
            });
        }
        const newMovie = {
            title: req.body.title,
            imageUrl: req.body.imageUrl,
            studio: req.body.studio,
            runningtime: req.body.runningtime,
            diretor: req.body.diretor,
            year: req.body.year,
            genre: req.body.genre
        }

        const movie = await Movie.create(newMovie);
        return res.status(201).send(movie);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
}

async function getAllMovies(req, res) {
    let page = req.query.page;
    let limit = req.query.limit;
    try {
        const movies = await Movie.find({})
            .limit(limit)
            .skip(page * limit)
            .sort({
                year: 'desc'
            });
        return res.status(200).send(movies);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
}

async function getMovieById(req, res){
    try{
        const { id } = req.params;
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).send({ message: 'Movie not found!' });
        }
        return res.status(200).send(movie);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
}

async function getMoviesByGenre(req, res) {
    try {
        const { genre } = req.params;
        if (!genre) {
            return res.status(400).send({ message: 'Genre parameter is required' });
        }
        const movies = await Movie.find({ genre: genre });
        if (movies.length === 0) {
            return res.status(404).send({ message: `No movies found in the '${genre}' genre` });
        }
        return res.status(200).send(movies);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
}

async function updateMovieById(req, res){
    try{
        if (
            !req.body.title ||
            !req.body.studio ||
            !req.body.runningtime ||
            !req.body.diretor ||
            !req.body.year
        ) {
            return res.status(400).send({
                message: 'Required fields: title, studio, runningtime, diretor, year'
            });
        }
        
        const { id } = req.params;

        const result = await Movie.findByIdAndUpdate(id, req.body);
        
        if(!result){
            return res.status(404).send({message: 'Movie not found!'});
        }
        return res.status(200).send({message: 'Movie info updated!'});
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
}

async function deleteMovieById(req, res){
    try{
        const { id } = req.params;
        const result = await Movie.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).send({ message: 'Movie not found!' });
        }
        return res.status(200).send({ message: 'Movie deleted!' });
    
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
}

async function uploadImage(req, res){
    try {
        if (!req.file) {
            return res.status(400).send({
                message: `No file uploaded, upload as form-data and key as 'image'`
            });
        }

        const file = req.file;

        return res.status(201).send({
            message: 'File uploaded successfully!',
            imageUrl: file.path
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
}

export default { createMovie, getAllMovies, getMovieById, updateMovieById, deleteMovieById, uploadImage, getMoviesByGenre };