import {AUTH0_PASSWORD, AUTH0_USERNAME, BACKEND_URL, PERMISSIONS_URL} from "../../src/utils/constants";

describe('Snippet detail tests', () => {
  const createSnippetAndOpenDetail = () => {
    const title = `Detail-${Date.now()}`;
    cy.intercept('POST', `${BACKEND_URL}/snippet`).as('createSnippet');
    cy.intercept('GET', `${BACKEND_URL}/snippet/*`).as('getSnippetById');

    cy.visit('/');
    cy.contains('button', 'Add Snippet').click();
    cy.contains('li', 'Create snippet').click();
    cy.get('#name').type(title);
    cy.get('[data-testid="add-snippet-code-editor"] textarea').type('let x: number = 1;\nprintln(x);', {force: true});
    cy.contains('button', 'Save').click();

    cy.wait('@createSnippet').its('response.statusCode').should('eq', 201);
    cy.contains('[data-testid="snippet-row"]', title).click();
    cy.wait('@getSnippetById');
  };

  beforeEach(() => {
    cy.loginToAuth0(
      AUTH0_USERNAME,
      AUTH0_PASSWORD
    );
    createSnippetAndOpenDetail();
  });

  it('Can share a snippet', () => {
    cy.intercept('GET', `${PERMISSIONS_URL}/users*`).as('getUsers');
    cy.intercept('POST', `${PERMISSIONS_URL}/snippets/*/members`).as('shareSnippet');

    cy.get('[aria-label="Share"]').click();
    cy.wait('@getUsers');
    cy.get('input[role="combobox"]').click();
    cy.get('[role="option"]').first().click();
    cy.contains('button', 'Share').click();

    cy.wait('@shareSnippet').its('response.statusCode').should('eq', 201);
  });

  it.skip('Can run snippets', function () {
    cy.get('[data-testid="PlayArrowIcon"]').click();
  });

  it('Can format snippets', function () {
    cy.intercept('POST', `${BACKEND_URL}/format/*`).as('formatSnippet');
    cy.get('[data-testid="ReadMoreIcon"]').click();
    cy.wait('@formatSnippet').its('response.statusCode').should('eq', 202);
  });

  it('Can save snippets', function () {
    cy.intercept('PUT', `${BACKEND_URL}/snippet/*`).as('updateSnippet');
    cy.get('.MuiDrawer-paper textarea').first().type('\nlet y: number = 2;', {force: true});
    cy.get('[data-testid="SaveIcon"]').click();
    cy.wait('@updateSnippet').its('response.statusCode').should('eq', 200);
  });

  it('Can delete snippets', function () {
    cy.intercept('DELETE', `${BACKEND_URL}/snippet/*`).as('deleteSnippet');
    cy.get('[data-testid="DeleteIcon"]').click();
    cy.contains('button', 'Delete').click();
    cy.wait('@deleteSnippet').its('response.statusCode').should('eq', 204);
  });
});
