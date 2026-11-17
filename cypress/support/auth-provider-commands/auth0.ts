

export function loginViaAuth0Ui(username: string, password: string) {
  // App landing page redirects to Auth0.
  cy.visit('/')

  const auth0Domain = Cypress.env('auth0_domain') || Cypress.env('VITE_AUTH0_DOMAIN') || Cypress.env('AUTH0_DOMAIN')

  // Login on Auth0.
  cy.origin(
      auth0Domain,
      { args: { username, password } },
      ({ username, password }) => {
        cy.get('input#username').type(username)
        cy.get('input#password').type(password, { log: false })
        cy.contains('button[value=default]', 'Continue').click()
      }
  )

  // Ensure Auth0 has redirected us back to the application and home is loaded
  cy.url().should('not.include', auth0Domain)
  cy.get('.MuiTypography-h6', { timeout: 15000 }).should('be.visible')
}




