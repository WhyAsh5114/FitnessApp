/// <reference types="cypress" />

describe('Testing new split creation', () => {
    before(() => {
        /**
         * Workaround for https://github.com/cypress-io/cypress/issues/17805
         * @see https://docs.cypress.io/api/commands/session#Explicitly-clearing-sessions
         */
        Cypress.session.clearAllSavedSessions()
      })

    beforeEach(() => {
        cy.login('sample_username', 'sample_password');
        cy.visit('http://localhost:3000/splits/new')
    })

    it('should load new split page', () => {
        cy.get('h2').should('contain.text', 'Create New Split')
    })

    it('should throw error (Enter split name, Enter at least 1 workout', () => {
        cy.get('button').contains('Create 0 workouts').click()
        cy.get('li').should('contain.text', 'Enter split name')
        cy.get('li').should('contain.text', 'Enter at least 1 workout')
    })

    it('should throw error (Enter split name)', () => {
        cy.get('[data-cy=split-schedule-grid] > :nth-child(1) > input').type('Push')
        cy.get('button').contains('Create 0 workouts').click()
        cy.get('li').should('contain.text', 'Enter split name')
    })

    it('should throw error (Enter at least 1 workout)', () => {
        cy.get('[data-cy=split-name-input]').type('PPL')
        cy.get('button').contains('Create 0 workouts').click()
        cy.get('li').should('contain.text', 'Enter at least 1 workout')
    })

    it('should increase and decrease button value according to workouts', () => {
        cy.get('[data-cy=split-schedule-grid] > :nth-child(1) > input').type('Push').blur()
        cy.get('button').should('contain.text', 'Create 1 workouts')

        cy.get('[data-cy=split-schedule-grid] > :nth-child(2) > input').type('Pull').blur()
        cy.get('button').should('contain.text', 'Create 2 workouts')

        cy.get('[data-cy=split-schedule-grid] > :nth-child(2) > input').clear().blur()
        cy.get('button').should('contain.text', 'Create 1 workouts')
        
        cy.get('[data-cy=split-schedule-grid] > :nth-child(1) > input').clear().blur()
        cy.get('button').should('contain.text', 'Create 0 workouts')
    })

    it('should automatically capitalize first letter', () => {
        cy.get('[data-cy=split-schedule-grid] > :nth-child(1) > input').type('push').blur()
        cy.get('[data-cy=split-schedule-grid] > :nth-child(1) > input').should('have.value', 'Push')
    })

    it('should not increase button value if workout is rest', () => {
        cy.get('[data-cy=split-schedule-grid] > :nth-child(2) > input').type('rest').blur()
        cy.get('button').should('contain.text', 'Create 0 workouts')

        cy.get('[data-cy=split-schedule-grid] > :nth-child(2) > input').type('Rest').blur()
        cy.get('button').should('contain.text', 'Create 0 workouts')
    })

    it('should not increase button value if workout is not unique', () => {
        cy.get('[data-cy=split-schedule-grid] > :nth-child(1) > input').type('Push').blur()
        cy.get('button').should('contain.text', 'Create 1 workouts')

        cy.get('[data-cy=split-schedule-grid] > :nth-child(2) > input').type('push').blur()
        cy.get('button').should('contain.text', 'Create 1 workouts')
    })
})