/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
Cypress.Commands.add('getAuth0Token', () => {
  const domain = Cypress.env('VITE_AUTH0_DOMAIN') || Cypress.env('auth0_domain') || Cypress.env('AUTH0_DOMAIN');
  const clientId = Cypress.env('VITE_AUTH0_CLIENT_ID') || Cypress.env('auth0_client_id') || Cypress.env('AUTH0_CLIENT_ID');
  const audience = Cypress.env('VITE_AUTH0_AUDIENCE') || 'https://snippet-api-dev';
  const username = Cypress.env('VITE_AUTH0_USERNAME') || Cypress.env('AUTH0_USERNAME');
  const password = Cypress.env('VITE_AUTH0_PASSWORD') || Cypress.env('AUTH0_PASSWORD');

  return cy.request({
    method: 'POST',
    url: `https://${domain}/oauth/token`,
    body: {
      grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
      username,
      password,
      audience,
      client_id: clientId,
      realm: 'Username-Password-Authentication'
    }
  }).then(res => res.body.access_token);
});
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }