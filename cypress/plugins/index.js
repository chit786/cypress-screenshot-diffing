// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
    on('task', {
        log(message) {
            console.log("----------------------------------------------------------------------------------");
            console.log("-----------------------" + message + " -------------------");
            console.log("**Use this run id to locate the image comparison results on visual review server**\n");
            console.log(`**Visual review server located at : ${config.env.vrServer} **\n\n`);
            return null;
        }
    });
};
