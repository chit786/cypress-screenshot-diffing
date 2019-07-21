// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
const RUN_PID_FILE = './screenDiff.json';

// const branch = require('git-branch').sync();

function _writeRunIdFile (run) {
    cy.writeFile(RUN_PID_FILE, run);
}

before(function() {
    Cypress.Screenshot.defaults(
        {
            scale: false,
            screenshotOnRunFailure : false
        });
    // runs once before all tests in the block
    cy.request('POST', `${Cypress.env('vrServer')}/api/runs`, {
        "branchName": "master",
        "projectName": "cypress-screenDiff",
        "suiteName": "testSuite"
    })
        .then((createdRun) => {
            if (createdRun) {
                cy.task('log', "run id for this image comparison is :" + createdRun.body.id);
                return _writeRunIdFile(JSON.stringify(createdRun));
            }
        });
});
// Alternatively you can use CommonJS syntax:
// require('./commands')
