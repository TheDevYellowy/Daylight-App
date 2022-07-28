const Client = require('./Base/Client');
const { sep } = require('path');
const readdir = require('util').promisify(require('fs').readdir);

module.exports = async (token) => {
    const client = new Client({
        DMSync: true,
        checkUpdate: false,
        patchVoice: true,
    });

    async function init() {
        const directories = await readdir(`.${sep}commands${sep}`)
        directories.forEach(async (dir) => {
            const commands = await readdir(`.${sep}commands${sep}${dir}${sep}`)
            commands.filter((cmd) => cmd.split(".").pop() === 'js').forEach((cmd) => {
                const response = client.loadCommand(`.${sep}commands${sep}${dir}`, cmd)
                if(response) {
                    console.log(response)
                }
            });
        });

        const evtFiles = await readdir(`.${sep}events${sep}`);
        evtFiles.forEach((file) => {
            const eventName = file.split(".")[0];
            const event = new(require(`.${sep}events${sep}${file}`))(client);
            client.on(eventName, (...args) => event.run(...args));
            delete require.cache[require.resolve(`.${sep}events${sep}${file}`)];
        });
    }

    return client;
}