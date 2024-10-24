import mongoose, { mongo } from "mongoose";
import Movies from "../models/MovieModel.js";
import { handleResponseError, handleResponseSuccess } from "../utils/responses.js";

const getMovies = async (req, res) => {
    try {
        const movies = await Movies.find()
        handleResponseSuccess(res, 200, "Get movies successfully", { movies })
    } catch (error) {
        console.log("error", error)
        handleResponseError(res, 500, "Internal server error")
    }
}

const getMovieById = async (req, res) => {
    const { id } = req.params 
    if(!mongoose.Types.ObjectId.isValid(id)) {
        handleResponseError(res, 400, "Incorrect format id")
        return
    }
    const checkMovieIdDb = await Movies.findById(id)
    if(!checkMovieIdDb) {
        handleResponseError(res, 404, "Movie not found")
        return
    }
    handleResponseSuccess(res, 200, "Get movie successfully", {
        title: checkMovieIdDb.title,
        year: checkMovieIdDb.year,
        poster: checkMovieIdDb.poster,
    })
}

const createNewMovie = async (req, res) => {
    const { title, year, poster } = req.body
    if(!title || !year || !poster) {
        handleResponseError(res, 400, "All fields are required")
    }
    const newMovie = await Movies.create({ title, year, poster })
    console.log("newMovie", {...newMovie})
    handleResponseSuccess(res, 201, "Create new movie successfully", {...newMovie._doc})
}

const updateMovie = async (req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        handleResponseError(res, 400, "Incorrect format id")
        return
    }
    const checkMovieIdDb = await Movies.findById(id)
    if (!checkMovieIdDb){
        handleResponseError(res, 404, "Movie not found")
        return
    }
    const { title, year, poster } = req.body
    if (!title || !year || !poster ) {
        handleResponseError(res, 400, "Bad request. All fields are required")
        return
    }
    await checkMovieIdDb.updateOne({ title, year, poster })
    handleResponseSuccess(res, 200, "Update movie successfully", {...checkMovieIdDb})
};

const deleteMovie = async (req, res) => {
    const { id } = req.params 
    if(!mongoose.Types.ObjectId.isValid(id)) {
        handleResponseError(res, 400, "Incorrect format id")
        return
    }
    const checkMovieIdDb = await Movies.findById(id)
    if(!checkMovieIdDb){
        handleResponseError(res, 404, "Movie not found")
        return
    }
    await Movies.findByIdAndDelete(id)
    handleResponseSuccess(res, 200, "Movie deleted successfully")
}

export { getMovies, getMovieById, createNewMovie, updateMovie, deleteMovie }
