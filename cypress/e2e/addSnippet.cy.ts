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
    cy.intercept('POST', BACKEND_URL+"/snippet*", (req) => {
      req.reply((res) => {
        expect(res.body).to.have.property("id");
        expect(res.body).to.have.property("content");
        expect(res.body).to.have.property("language");
        expect(res.statusCode).to.be.oneOf([200, 201]);
      });
    }).as('postRequest');

    /* ==== Generated with Cypress Studio ==== */
    cy.get('.css-9jay18 > .MuiButton-root').click();
    cy.get('.MuiList-root > [tabindex="0"]').click();
    cy.get('#name').type('Some snippet name ' + Date.now());
    cy.get('#demo-simple-select').click()
    cy.get('[data-testid="menu-option-printscript"]').click()

    cy.get('[data-testid="add-snippet-code-editor"]').click();
    cy.get('[data-testid="add-snippet-code-editor"]').type(`let snippet: string = "some snippet";\nprintln(snippet);`);
    cy.get('[data-testid="SaveIcon"]').click();

    cy.wait('@postRequest').its('response.statusCode').should('be.oneOf', [200, 201]);
  })

  it('Can add snippets via file', () => {
    cy.visit("/")
    cy.intercept('POST', BACKEND_URL+"/snippet*", (req) => {
      req.reply((res) => {
        expect(res.body).to.have.property("id");
        expect(res.body).to.have.property("content");
        expect(res.body).to.have.property("language");
        expect(res.statusCode).to.be.oneOf([200, 201]);
      });
    }).as('postRequest');

    cy.get('.MuiTypography-h6').should('be.visible');
    cy.wait(2000);

    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-testid="upload-file-input"]').selectFile("cypress/fixtures/example_ps.prs", {force: true})

    cy.get('[data-testid="SaveIcon"]', { timeout: 10000 }).click();

    cy.wait('@postRequest').its('response.statusCode').should('be.oneOf', [200, 201]);
  })
})
