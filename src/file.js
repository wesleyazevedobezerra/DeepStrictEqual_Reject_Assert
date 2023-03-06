const { readFile } = require('fs/promises') //variavel readFile para ler arquivo 
const User = require('./user') // importo a função User
const { error } = require('./constants') //importo a variavel error do arquivo constants.js

const DEFAULT_OPTION = { // Validações para o teste passar
    maxLines: 3,
    fields: ["id", "name", "profession", "age"]
}
class File {
    static async csvToJson(filePath) {
        const content = await File.getFileContent(filePath) //Envio o caminho do arquivo para a função getFileContent  e aguardo retorno do arquivo
        const validation = File.isValid(content) //Envio o conteudo do arquivo para validar os dados
        if(!validation.valid) throw new Error(validation.error) //Caso a validação == false, jogo o erro

        const users = File.parseCSVToJSON(content) //Transformo conteudo CSV para json
        return users
    }

    static async getFileContent(filePath) {
        return (await readFile(filePath)).toString("utf8")
    }
    static isValid(csvString, options = DEFAULT_OPTION) {
        //  adicionada regra para suportar quebra de linha (\r\n) do Windows
        
        //__dirname = Caminho fisico =  F:\JavaScript_Full_Master_Ultra_Projects\javascript_mocks\
        //filePath = caminho pasta  = mocks/threeItems-valid.csv'
        //filename =  F:\JavaScript_Full_Master_Ultra_Projects\javascript_mocks\mocks\threeItems-valid.csv

        const [header, ...fileWithoutHeader] = csvString.split(/\r?\n/)
            /*
        const [header, ...fileWithoutHeader] => // A primeira linha do array (id, name, profession, age) é colocada na variavel header
        e o restante de todas as linhas na variavelé colocada na variavel ...fileWithoutHeader
        */
        const isHeaderValid = header === options.fields.join(',')
        if(!isHeaderValid) {
            return {
                error: error.FILE_FIELDS_ERROR_MESSAGE,
                valid: false
            }
        }

        const isContentLengthAccepted = ( //Se as linhas do fileWithoutHeader for maior que zero e menor que o maxLines retorna true
            fileWithoutHeader.length > 0 &&
            fileWithoutHeader.length <= options.maxLines
        )
        if(!isContentLengthAccepted) { //Se for false rerotno erro
            return {
                error: error.FILE_LENGTH_ERROR_MESSAGE,
                valid: false
            }
        }

        return { valid: true }
    }
    static parseCSVToJSON(csvString) {
        const lines = csvString.split('\n')
        // remove o primeiro item e joga na variavel
        const firstLine = lines.shift()
        const header = firstLine.split(',') //capturo a primeira linha e separo por array e coloco na variavel header
        const users = lines.map(line => {
            const columns = line.split(',') //dentro da linha do array é criado um outro array para coluna 
            let user = {}
            for(const index in columns) {
                user[header[index]] = columns[index] //faço a concaternização do header e da coluna
            }
            return new User(user)
        })
        return users
    }
}

module.exports = File