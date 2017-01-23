const fs = require('fs');
const open = require('open');
const chalk = require('chalk');

module.exports.open = () => {
    const path = `${process.env.NODE_PATH}/coverage/lcov-report/index.html`;
    fs.access(path, (err) => {
        if (err) {
            const message = `istanbul coverage html file is not exists\nWRONG PATH : ${path}`;
            console.log(chalk.bold.red(message));
            return;
        }
        open(path);
    });
};
