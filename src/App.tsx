import React, { useEffect, useState } from 'react';
import { Movie } from './api/data/SearchResponse';
import { searchMovies } from './api/OMDb';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import SearchBar from './components/SearchBar';
import ClickableMovie from './components/ClickableMovie';

import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';

type SearchResults = {
    title: string;
    movies: Movie[];
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        padding: theme.spacing(3),
        margin: theme.spacing(1),
    },
    item: {
        marginBottom: theme.spacing(1),
    },
}));

function App() {
    const [searchResults, setSearchResults] = useState<SearchResults>();
    const [nominations, setNominations] = useState<Movie[]>([]);

    const classes = useStyles();

    useEffect(() => {
        if (nominations.length === 5) {
            window.alert('Thank you! You have nominated 5 movies');
        }
    }, [nominations]);

    function nominate(movie: Movie) {
        if (nominations.length === 5) {
            window.alert('You have already nominated 5 movies');
            return;
        }

        setNominations([...nominations, movie]);
    }

    function removeFromNominations(movie: Movie) {
        setNominations(
            nominations.filter(
                (nomination) => nomination.imdbID !== movie.imdbID
            )
        );
    }

    function isMovieNominated(movie: Movie) {
        return nominations.some(
            (nomination) => nomination.imdbID === movie.imdbID
        );
    }

    return (
        <Box className={classes.root} display="flex" justifyContent="center">
            <div className="App">
                <CssBaseline />

                <ThemeProvider theme={theme}>
                    <header>
                        <Typography variant="h1">The Shoppies</Typography>
                    </header>

                    <Paper className={`Search ${classes.paper}`}>
                        <Typography variant="h3">Movie title</Typography>
                        <SearchBar
                            onSearch={async (title) => {
                                setSearchResults({
                                    title,
                                    movies: await searchMovies(title),
                                });
                            }}
                        />
                    </Paper>

                    <Paper className={`SearchResults ${classes.paper}`}>
                        <Typography variant="h2">
                            Results for {searchResults?.title}
                        </Typography>
                        <ul>
                            {searchResults?.movies.map((movie) => (
                                <li key={movie.imdbID} className={classes.item}>
                                    <ClickableMovie
                                        movie={movie}
                                        buttonText="Nominate"
                                        onClick={nominate}
                                        isClickDisabled={isMovieNominated(
                                            movie
                                        )}
                                    />
                                </li>
                            ))}
                        </ul>
                    </Paper>

                    <Paper className={`Nominations ${classes.paper}`}>
                        <Typography variant="h2">Nominations</Typography>
                        <ul>
                            {nominations.map((movie) => (
                                <li key={movie.imdbID} className={classes.item}>
                                    <ClickableMovie
                                        movie={movie}
                                        buttonText="Remove"
                                        onClick={removeFromNominations}
                                    />
                                </li>
                            ))}
                        </ul>
                    </Paper>
                </ThemeProvider>
            </div>
        </Box>
    );
}

export default App;
