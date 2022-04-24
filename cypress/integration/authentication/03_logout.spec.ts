/// <reference types="cypress" />

describe('Testing login', () => {
    before(() => {
        /**
         * Workaround for https://github.com/cypress-io/cypress/issues/17805
         * @see https://docs.cypress.io/api/commands/session#Explicitly-clearing-sessions
         */
        Cypress.session.clearAllSavedSessions()
      })

    beforeEach(() => {
        cy.login('sample_username', 'sample_password')
        Cypress.Cookies.preserveOnce('session_id')
        cy.visit('http://localhost:3000/profile')
    })

    it('should logout and redirect to login', () => {
        cy.get('button').contains('Logout').click()
        cy.get('h1').should('contain.text', 'Login to continue')
    })

    it('should redirect to login instead of profile', () => {
        cy.get('h1').should('contain.text', 'Login to continue')
    })
})