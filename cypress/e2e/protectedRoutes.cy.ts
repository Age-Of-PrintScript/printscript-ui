import {AUTH0_PASSWORD, AUTH0_USERNAME} from "../../src/utils/constants";

describe('Protected routes test', () => {
  it('should redirect to login when accessing a protected route unauthenticated', () => {
    cy.visit('/');

    cy.origin(`https://${Cypress.env('VITE_AUTH0_DOMAIN')}`, () => {
      cy.url().should('include', '/u/login');
    });
  });

  it('should display login content', () => {
    cy.visit('/');

    cy.origin(`https://${Cypress.env('VITE_AUTH0_DOMAIN')}`, () => {
      cy.contains('Log in').should('exist');
      cy.contains('Password').should('exist');
    });
  });

  it('should not redirect to login when the user is already authenticated', () => {
    cy.loginToAuth0(
      AUTH0_USERNAME,
      AUTH0_PASSWORD
    );

    cy.visit('/');

    cy.get('.MuiTypography-h6', {timeout: 10000}).should('have.text', 'Printscript');
    cy.url().should('not.include', '/u/login');
  });
});
