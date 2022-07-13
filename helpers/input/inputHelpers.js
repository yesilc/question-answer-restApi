const bcrypt = require("bcryptjs");
const validateUserInput = (email,password) => {
    return email && password //eğer email ya da password undefined olursa false olarak dönecek
}
const comparePassword = (password,hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword); //password ve hashedpassword'ü karşılaştırıp eşleşiyorsa true eşleşmiyorsa false döndürecek
};
module.exports = {validateUserInput,comparePassword};