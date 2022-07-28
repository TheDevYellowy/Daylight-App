const { Client, Collection, Guild, Message, GuildMember } = require('discord.js-selfbot-v13');
const fs = require('fs');
const { sep } = require('path');
let config;

fs.exists('../../config/options.json', (there) => {
    if(there) config = require('../../config/options.json');
    else {
        fs.mkdirSync('../../config/options.json', { recursive: true });
        fs.writeFileSync('../../config/options.json', JSON.stringify({}));
        config = require('../../config/options.json');
    }
});

class Daylight extends Client {
    constructor() {
        super({ DMSync: true, checkUpdate: false, patchVoice: true });

        this.commands = new Collection();
        this.aliases = new Collection();

        this.codes = [];

        this.vcKick = [];
        this.vcMute = [];
        this.config = require('../../config/options.json');
    }

    /**
     * 
     * @param {Guild} guild guild the member is in
     * @param {string} member member id or <@id>
     * @param {Message?} message optional message that the member was mentioned in
     * @returns {GuildMember} the first member that is pinged / a GuildMember object
     */
    async fetchMember(guild, member, message = null) {
        if(message) {
            if(message.mentions.members.first()) return message.mentions.members.first();
        }

        if(member) {
            if(member.startsWith('<')) member.slice(2, -1);
            if(member.startsWith('!')) member.slice(1);
            return guild.members.cache.get(member);
        }
    }

    loadCommand(pth, name) {
        try {
            const props = new (require(`.${pht}${sep}${name}`))(this);
            props.conf.location = pth;
            if(props.init) props.init(this);
            this.commands.set(props.help.name, props);
        } catch (e) {
            return `Unable to load command ${name}: ${e}`;
        }
    }
}

module.exports = Daylight;