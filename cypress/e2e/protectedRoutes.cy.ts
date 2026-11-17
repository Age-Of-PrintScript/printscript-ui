import {AUTH0_USERNAME, AUTH0_PASSWORD} from "../../src/utils/constants";

describe('Protected routes test', () => {
  const getAuth0Domain = () =>
    Cypress.env('auth0_domain') || Cypress.env('VITE_AUTH0_DOMAIN') || Cypress.env('AUTH0_DOMAIN');

  it('should redirect to login when accessing a protected route unauthenticated', () => {
    const auth0Domain = getAuth0Domain();
    cy.visit('/');

    cy.origin(auth0Domain, () => {
      cy.url({ timeout: 15000 }).should('include', '/u/login');
    });
  });

  it('should display login content', () => {
    const auth0Domain = getAuth0Domain();
    cy.visit('/');

    cy.origin(auth0Domain, () => {
      cy.get('input#username', { timeout: 15000 }).should('exist');
      cy.get('input#password').should('exist');
      cy.contains('button[value=default]', 'Continue').should('exist');
    });
  });

  it('should not redirect to login when the user is already authenticated', () => {
    const auth0Domain = getAuth0Domain();
    cy.loginToAuth0(
      AUTH0_USERNAME,
      AUTH0_PASSWORD
    );

    cy.visit('/');

    cy.get('.MuiTypography-h6', { timeout: 15000 }).should('be.visible');
    cy.url().should('not.include', auth0Domain);
  });
});
