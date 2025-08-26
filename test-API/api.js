async function buscarFilmes(){ // aqui a ideia é buscar filmes na API, esse Async significa que ele vai permitir o uso de await dentro da função
    const filmes = document.getElementById('filme').value; // aqui estamos puxando o valor do que a pessoa digitou
    const resultado = document.getElementById('resultado');

    try {
        const apiKey = '76d952f4'
        
    } catch (error) {
        resultado.innerHTML = 'Erro ao buscar filmes: ';
    }

    //resultado.innerHTML = `${filmes}`

}