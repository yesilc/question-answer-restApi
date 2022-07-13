class CustomError extends Error { //kalıtım
    constructor(message,status){
        super(message); //mesajı error class'ına veriyoruz
        this.status = status //error class'ın statusu olmadıgı için this.status=satatus
    }
}

module.exports = CustomError;