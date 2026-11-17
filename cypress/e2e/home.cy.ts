import {AUTH0_PASSWORD, AUTH0_USERNAME, BACKEND_URL, FRONTEND_URL} from "../../src/utils/constants";

describe('Home', () => {
  beforeEach(() => {
    cy.loginToAuth0(
        AUTH0_USERNAME,
        AUTH0_PASSWORD
    )
  })
  it('Renders home', () => {
    cy.visit(FRONTEND_URL)
    cy.get('.MuiTypography-h6').should('have.text', 'Printscript');
    cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').should('be.visible');
  })

  // You need to have at least 1 snippet in your DB for this test to pass
  it('Renders the first snippets', () => {
    cy.visit(FRONTEND_URL)
    const first10Snippets = cy.get('[data-testid="snippet-row"]')

    first10Snippets.should('have.length.greaterThan', 0)
    first10Snippets.should('have.length.lessThan', 11)
  })

  it('Can create snippet and find snippets by name', () => {
    const snippetName = `Test-${Date.now()}`;
    cy.visit(FRONTEND_URL)

    cy.intercept('POST', `${BACKEND_URL}/snippet`).as('createSnippet');
    cy.intercept('GET', `${BACKEND_URL}/snippet*`).as('getSnippets');

    cy.contains('button', 'Add Snippet').click();
    cy.contains('li', 'Create snippet').click();
    cy.get('#name').type(snippetName);
    cy.get('[data-testid="add-snippet-code-editor"] textarea').type('let a: number = 1;', {force: true});
    cy.contains('button', 'Save').click();

    cy.wait('@createSnippet').its('response.statusCode').should('eq', 201);

    cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').clear().type(snippetName);
    cy.wait('@getSnippets');
    cy.contains(snippetName).should('exist');
  })
})
