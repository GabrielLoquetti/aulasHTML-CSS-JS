async function buscarFilmes(){ // aqui a ideia é buscar filmes na API, esse Async significa que ele vai funcionar de forma assincrona permitindo o uso de await dentro da função
    const filmes = document.getElementById('filme').value; // aqui estamos puxando o valor do que a pessoa digitou
    const resultado = document.getElementById('resultado');

    try {
        const apiKey = '76d952f4' // Sua API Key

        const resposta = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(filmes)}&apikey=${apiKey}`);
        const dados = await resposta.json();

        resultado.innerHTML = `
    <style>
        .filme-card {
            max-width: 450px;
            margin: 20px auto;
            padding: 18px;
            border-radius: 16px;
            background: #ffffff;
            color: #333;
            font-family: "Inter", sans-serif;
            text-align: left;
            box-shadow: 0 4px 16px rgba(0,0,0,0.08);
            transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .filme-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 6px 24px rgba(0,0,0,0.12);
        }

        .filme-card h2 {
            font-size: 20px;
            margin: 0 0 10px;
            color: #111;
        }

        .filme-card p {
            margin: 6px 0;
            font-size: 14px;
            line-height: 1.5;
            color: #555;
        }

        .filme-card img {
            width: 100%;
            height: auto;
            border-radius: 12px;
            margin: 12px 0;
        }

        .filme-card strong {
            color: #111;
            font-weight: 600;
        }
    </style>

    <div class="filme-card">
        <h2>${dados.Title}</h2>
        <img src="${dados.Poster}" alt="${dados.Title}">
        <p>${dados.Plot}</p>
        <p><strong>Ano:</strong> ${dados.Year}</p>
        <p><strong>Diretor:</strong> ${dados.Director}</p>
        <p><strong>Atores:</strong> ${dados.Actors}</p>
        <p><strong>Gênero:</strong> ${dados.Genre}</p>
        <p><strong>Idioma:</strong> ${dados.Language}</p>
        <p><strong>País:</strong> ${dados.Country}</p>
        <p><strong>Avisos:</strong> ${dados.Awards}</p>
    </div>
`;

    } catch (error) {
        resultado.innerHTML = 'Erro ao buscar filmes: ';
    }

    //resultado.innerHTML = `${filmes}`


    /* PARA ENTENDER:
    A RESPOSTA EM JSON QUE VEM DO BANCO DE DADOS DOS FILMES CHEGA ASSIM, AI VOCÊ PODE FILTRAR DE ACORDO COM O QUE GOSTARIA DE VER
    {"Title":"Rio",
    "Year":"2011",
    "Rated":"G",
    "Released":"15 Apr 2011",
    "Runtime":"96 min",
    "Genre":"Animation, Adventure, Comedy",
    "Director":"Carlos Saldanha",
    "Writer":"Carlos Saldanha, Earl Richey Jones, Todd R. Jones",
    "Actors":"Jesse Eisenberg, Anne Hathaway, George Lopez",
    "Plot":"When Blu, a domesticated macaw from small-town Minnesota, meets the fiercely independent Jewel, he takes off on an adventure to 
    Rio de Janeiro with the bird of his dreams.",
    "Language":"English, Portuguese, Arabic, Spanish, Brazilian Sign ",
    "Country":"United States, United Kingdom",
    "Awards":"Nominated for 1 Oscar. 3 wins & 31 nominations total",
    "Poster":"https://m.media-amazon.com/images/M/MV5BMTU2MDY3MzAzMl5BMl5BanBnXkFtZTcwMTg0NjM5NA@@._V1_SX300.jpg",
    "Ratings":[{"Source":"Internet Movie Database","Value":"6.9/10"},{"Source":"Rotten Tomatoes","Value":"72%"},{"Source":"Metacritic","Value":"63/100"}],
    "Metascore":"63",
    "imdbRating":"6.9",
    "imdbVotes":"263,537",
    "imdbID":"tt1436562",
    "Type":"movie",
    "DVD":"N/A",
    "BoxOffice":"$143,619,809",
    "Production":"N/A",
    "Website":"N/A",
    "Response":"True"}
    */
}