import {AUTH0_PASSWORD, AUTH0_USERNAME, BACKEND_URL, PERMISSIONS_URL} from "../../src/utils/constants";

describe('Snippet detail tests', () => {
  beforeEach(() => {
    cy.loginToAuth0(
        AUTH0_USERNAME,
        AUTH0_PASSWORD
    );
    cy.intercept('GET', `${BACKEND_URL}/snippet*`).as('getSnippets');
    cy.intercept('GET', `${BACKEND_URL}/snippet/*`).as('getSnippetById');

    cy.visit('/');
    cy.wait('@getSnippets');

    cy.get('[data-testid="snippet-row"]', { timeout: 10000 }).first().click();
    cy.wait('@getSnippetById');
  });

  it('Can share a snippet', () => {
    cy.intercept('GET', `${PERMISSIONS_URL}/users*`).as('getUsers');
    cy.intercept('POST', `${PERMISSIONS_URL}/snippets/*/members`).as('shareSnippet');

    cy.get('[aria-label="Share"]').click();
    cy.get('input[role="combobox"]').click();
    cy.wait('@getUsers');
    cy.get('[role="listbox"] [role="option"]', { timeout: 10000 }).first().click();
    cy.contains('button', 'Share').click();

    cy.wait('@shareSnippet').its('response.statusCode').should('be.oneOf', [200, 201, 204]);
  });

  it('Can format snippets', () => {
    cy.get('[data-testid="ReadMoreIcon"]').click();
  });

  it('Can save snippets', () => {
    cy.intercept('PUT', `${BACKEND_URL}/snippet/*`).as('updateSnippet');

    cy.get('.npm__react-simple-code-editor__textarea').first().click();
    cy.get('.npm__react-simple-code-editor__textarea').first().type('\nlet cypressVar: number = 1;');
    cy.get('[data-testid="SaveIcon"]').click();

    cy.wait('@updateSnippet').its('response.statusCode').should('eq', 200);
  });

  it('Can delete snippets', () => {
    cy.intercept('DELETE', `${BACKEND_URL}/snippet/*`).as('deleteSnippet');

    cy.get('[data-testid="DeleteIcon"]').click();
    cy.contains('button', 'Delete').click();

    cy.wait('@deleteSnippet').its('response.statusCode').should('be.oneOf', [200, 204]);
  });
});
