/// <reference types="cypress" />

describe('Testing new split workouts', () => {
    before(() => {
        /**
         * Workaround for https://github.com/cypress-io/cypress/issues/17805
         * @see https://docs.cypress.io/api/commands/session#Explicitly-clearing-sessions
         */
        Cypress.session.clearAllSavedSessions()
    })

    beforeEach(() => {
        cy.login('sample_username', 'sample_password');
        cy.visit('http://localhost:3000/splits/new/workouts')
    })

    it('should show no split schedule created', () => {
        cy.get('p').should('contain.text', 'No split schedule created')
    })

    it('should redirect to new split', () => {
        cy.get('a').contains('Create here').click()
        cy.url().should('eq', 'http://localhost:3000/splits/new')
    })
})