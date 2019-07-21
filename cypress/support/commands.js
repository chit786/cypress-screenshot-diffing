// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const RUN_PID_FILE = './screenDiff.json';

function _readRunIdFile() {
    return cy.readFile(RUN_PID_FILE);
}

const diffPercentage = 0.2; // minimum allowed screen diff perentage of visual review server

Cypress.Commands.add("form_request", (method, url, formData) => {
    return cy
            .server()
            .route(method, url).as('postImage')
            .window()
            .then((win) => {
                const xhr = new win.XMLHttpRequest();
                xhr.open(method, url);
                xhr.send(formData);
            })
            .wait('@postImage')
            .its('response')
            .then((resp) => {
                let status = true;
                cy.readFile(RUN_PID_FILE).then((run) => {
                    const url = `${Cypress.env('vrServer')}/api/runs/${run.body.id}/analysis`;
                    cy.request(url).then((analysis) => {
                        for(const item of analysis.body.diffs) {
                            if (item.after.imageId === resp.body.imageId) {
                                if (item.percentage >= diffPercentage && !Cypress.env("doBaseLine")) {
                                    status = false;
                                }
                                expect(status, 'image comparison successful ?').to.be.true;
                             }
                        }
                    });
                });
            });
});

Cypress.Commands.add("takeScreenShot", (fileName, options) => {

    if(Cypress.env("disableScreenDiff")) {
        return true;
    }
    cy.wait(1000);
    // take screenshot
    cy.screenshot(fileName, {
        blackout: (options && options.blackout) ? options.blackout : [],
        capture: (options && options.capture) ? options.capture : 'fullPage',
        clip: (options && options.clip) ? options.clip : null,
        disableTimersAndAnimations: (options && options.disableTimersAndAnimations) ? options.disableTimersAndAnimations : false,
        scale: (options && options.scale) ? options.scale : false,
        onBeforeScreenshot: (options && options.onBeforeScreenshot) ? options.onBeforeScreenshot : null,
        onAfterScreenshot($el, props) {
            Cypress.env('props', props);
        },
    }).then(() => {
        // get current run information
        _readRunIdFile().then((run) => {
            const formData = new FormData();
            const method = 'POST';
            const url = `${Cypress.env('vrServer')}/api/runs/${run.body.id}/screenshots`;
            const fileType = 'image/png';
            const path = Cypress.env('props').path;
            const newPath = path.split(Cypress.config('screenshotsFolder'))[1];
            // get the file and send it to visual review server for image diff
            cy.fixture(`../screenshots/${newPath}`, 'base64').then((img) => {
                cy.task('log', `${Cypress.env('props').name} is generated`);
                Cypress.Blob.base64StringToBlob(img, fileType).then((blob) => {
                    formData.set('file', blob, `${Cypress.env('props').name}.png`);
                    formData.set('screenshotName', Cypress.env('props').name);
                    formData.set('properties', JSON.stringify({
                        resolution: Cypress.env('props').dimensions.width + 'x' + Cypress.env('props').dimensions.height,
                        browser: 'chrome'
                    }));

                    formData.set('compareSettings', JSON.stringify({
                        "precision": diffPercentage
                    }));
                    formData.set('meta', JSON.stringify({}));
                        // make call and compare images
                    cy.form_request(method, url, formData);
                });
            });
        });
    });
});
