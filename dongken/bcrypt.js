const bcrypt = require('bcrypt');

const password = 'password';
const saltRounds = 12;

const makeHash = async(password, saltRounds) => {
    return await bcrypt.hash(password, saltRounds)
}

const main = async () => {
    const hashedPassword = await makeHash(password, saltRounds)
    console.log(hashedPassword)
}


const checkHash = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}
main()

const main2 = async () => {
    const hashedPassword = await makeHash("password", 12);
    const result = await checkHash("password", hashedPassword);
    console.log(result);
};

main2()