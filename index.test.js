const { error } = require('./src/constants')
const File = require('./src/file')
const { rejects, deepStrictEqual } = require('assert') //Rejects, deepStrictEqual usado para fazer testes
    ;
(async () => {
    {
        const filePath = './mocks/emptyFile-invalid.csv'
        const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
        const result = File.csvToJson(filePath)
        await rejects(result, rejection) //Caso receba algum erro no result disparo rejeitado, caso contrario passa sem erro
    }
    {
        const filePath = './mocks/fourItems-invalid.csv'
        const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
        const result = File.csvToJson(filePath)
        await rejects(result, rejection) //Caso receba algum erro no result disparo rejeitado, caso contrario passa sem erro
    }
    {

        Date.prototype.getFullYear = () => 2020
        const filePath = './mocks/threeItems-valid.csv'
        const result = await File.csvToJson(filePath)
        const expected = [
            {
                "name": "Wesley Azevedo",
                "id": 123,
                "profession": "Javascript Instructor",
                "birthDay": 1995
            },
            {
                "name": "Xuxa da Silva",
                "id": 321,
                "profession": "Javascript Specialist",
                "birthDay": 1940
            },
            {
                "name": "Joaozinho",
                "id": 231,
                "profession": "Java Developer",
                "birthDay": 1990
            }
        ]

        deepStrictEqual(JSON.stringify(result), JSON.stringify(expected))
        //deepStrictEqual irá validar o resultado com o valor esperado

    }
})()