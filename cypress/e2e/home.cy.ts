import {AUTH0_PASSWORD, AUTH0_USERNAME, BACKEND_URL} from "../../src/utils/constants";

describe('Home', () => {
  beforeEach(() => {
    cy.loginToAuth0(
        AUTH0_USERNAME,
        AUTH0_PASSWORD
    )
  })
  it('Renders home', () => {
    cy.visit('/')
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiTypography-h6').should('have.text', 'Printscript');
    cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').should('be.visible');
    cy.get('.css-9jay18 > .MuiButton-root').should('be.visible');
    cy.get('.css-jie5ja').click();
    /* ==== End Cypress Studio ==== */
  })

  // You need to have at least 1 snippet in your DB for this test to pass
  it('Renders the first snippets', () => {
    cy.visit('/')
    const first10Snippets = cy.get('[data-testid="snippet-row"]')

    first10Snippets.should('have.length.greaterThan', 0)

    first10Snippets.should('have.length.lessThan', 10)
  })

  it('Can creat snippet find snippets by name', () => {
    cy.visit('/')
    const snippetName = "Test name " + Date.now();
    const snippetData = {
      title: snippetName,
      content: 'let a: string = "hello";\nprintln(a);',
      language: "printscript",
      languageVersion: "1.1"
    };

    cy.intercept('GET', BACKEND_URL+"/snippet*", (req) => {
      req.reply((res) => {
        expect(res.statusCode).to.eq(200);
      });
    }).as('getSnippets');

    cy.getAuth0Token().then((token) => {
      cy.request({
        method: 'POST',
        url: BACKEND_URL + '/snippet',
        headers: { Authorization: `Bearer ${token}` },
        body: snippetData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 201]);
        expect(response.body).to.have.property("id");

        cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').clear();
        cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').type(snippetName + "{enter}");

        cy.wait("@getSnippets");
        cy.contains(snippetName).should('exist');
      });
    });
  })
})
