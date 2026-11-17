import {AUTH0_PASSWORD, AUTH0_USERNAME, BACKEND_URL} from "../../src/utils/constants";

describe('Add snippet tests', () => {
  beforeEach(() => {
    cy.loginToAuth0(
        AUTH0_USERNAME,
        AUTH0_PASSWORD
    )
  })
  it('Can add snippets manually', () => {
    cy.visit("/")
    cy.intercept('POST', `${BACKEND_URL}/snippet`).as('postRequest');

    cy.contains('button', 'Add Snippet').click();
    cy.contains('li', 'Create snippet').click();
    cy.get('#name').type('Some snippet name');
    cy.get('#demo-simple-select').click();
    cy.get('[data-testid="menu-option-printscript"]').click();

    cy.get('[data-testid="add-snippet-code-editor"] textarea').type('let snippet: string = "some snippet";\nprintln(snippet);', {force: true});
    cy.contains('button', 'Save').click();

    cy.wait('@postRequest').its('response.statusCode').should('eq', 201);
  })

  it('Can add snippets via file', () => {
    cy.intercept('GET', `${BACKEND_URL}/languages`).as('getLanguages');
    cy.intercept('POST', `${BACKEND_URL}/snippet`).as('postRequest');

    cy.visit("/")
    cy.wait(['@getLanguages', '@getLanguages'], {timeout: 15000});

    cy.get('[data-testid="upload-file-input"]').selectFile("cypress/fixtures/example_ps.ps", {force: true});

    cy.contains('button', 'Save', {timeout: 10000}).click();

    cy.wait('@postRequest').its('response.statusCode').should('eq', 201);
  })
})
