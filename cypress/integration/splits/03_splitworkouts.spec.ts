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

        cy.visit('http://localhost:3000/splits/new')
        cy.get('[data-cy=split-name-input]').type('PPL').blur()
        cy.get('[data-cy=split-schedule-grid] > :nth-child(1) > input').type('Push', {force: true}).blur()
        cy.get('[data-cy=split-schedule-grid] > :nth-child(2) > input').type('Pull').blur()
        cy.get('[data-cy=split-schedule-grid] > :nth-child(3) > input').type('Legs').blur()
        cy.get('a').contains('Create 3 workouts').click()
    })

    it('should load with first workout (Push)', () => {
        cy.url().should('eq', 'http://localhost:3000/splits/new/workouts')
        cy.get('[data-cy=split-name]').should('contain.text', 'Push')
    })

    it('should cycle between workouts appropriately', () => {
        cy.get('button').contains('>').click()
        cy.get('[data-cy=split-name]').should('contain.text', 'Pull')

        cy.get('button').contains('>').click()
        cy.get('[data-cy=split-name]').should('contain.text', 'Legs')

        cy.get('button').should('not.contain.text', '>')

        cy.get('button').contains('<').click()
        cy.get('[data-cy=split-name]').should('contain.text', 'Pull')

        cy.get('button').contains('<').click()
        cy.get('[data-cy=split-name]').should('contain.text', 'Push')

        cy.get('button').should('not.contain.text', '<')
    })

    it('should add exercise: Bench Press [5x3x50], to Push', () => {
        cy.get('button').contains('Add').click()

        cy.get('[data-cy=exercise-name-input]').type('Bench Press')
        cy.get('[data-cy=exercise-reps-input]').type('5')
        cy.get('[data-cy=exercise-sets-input]').type('3')
        cy.get('[data-cy=exercise-load-input]').type('50')
        cy.get('button').contains('Save').click()

        cy.get('[data-cy=exercise-id-p]').should('contain.text', '1')
        cy.get('[data-cy=exercise-name-p]').should('contain.text', 'Bench Press')
        cy.get('[data-cy=exercise-reps-p]').should('contain.text', '5')
        cy.get('[data-cy=exercise-sets-p]').should('contain.text', '3')
        cy.get('[data-cy=exercise-load-p]').should('contain.text', '50')
    })

    it('should throw errors when adding exercise with invalid values', () => {
        cy.get('button').contains('Add').click()

        cy.get('button').contains('Save').click()
        cy.get('li').should('contain.text', 'Exercise name should not be empty')
        cy.get('li').should('contain.text', 'Reps, Sets, Load should be a number')
        cy.get('button').contains('OK').click()

        cy.get('[data-cy=exercise-name-input]').type('Bench Press')
        cy.get('button').contains('Save').click()
        cy.get('li').should('contain.text', 'Reps, Sets, Load should be a number')
        cy.get('button').contains('OK').click()

        cy.get('[data-cy=exercise-reps-input]').type('5')
        cy.get('[data-cy=exercise-sets-input]').type('3')
        cy.get('[data-cy=exercise-load-input]').type('50')
        cy.get('button').contains('Save').click()
        cy.get('li').should('contain.text', 'Exercise name should not be empty')
        cy.get('button').contains('OK').click()

        cy.get('[data-cy=exercise-reps-input]').type('5')
        cy.get('[data-cy=exercise-sets-input]').type('invalid number')
        cy.get('[data-cy=exercise-load-input]').type('123!@#asdf')
        cy.get('button').contains('Save').click()
        cy.get('li').should('contain.text', 'Exercise name should not be empty')
        cy.get('li').should('contain.text', 'Reps, Sets, Load should be a number')
        cy.get('button').contains('OK').click()
    })

    it('should remove one exercise', () => {
        cy.get('button').contains('Add').click()
        cy.get('[data-cy=exercise-name-input]').type('Bench Press')
        cy.get('[data-cy=exercise-reps-input]').type('5')
        cy.get('[data-cy=exercise-sets-input]').type('3')
        cy.get('[data-cy=exercise-load-input]').type('50')
        cy.get('button').contains('Save').click()

        cy.get('button').contains('Add').click()
        cy.get('[data-cy=exercise-name-input]').clear().type('Shoulder Press')
        cy.get('[data-cy=exercise-reps-input]').clear().type('12')
        cy.get('[data-cy=exercise-sets-input]').clear().type('3')
        cy.get('[data-cy=exercise-load-input]').clear().type('10')
        cy.get('button').contains('Save').click()

        cy.get('button').contains('Add').click()
        cy.get('[data-cy=exercise-name-input]').clear().type('Incline Bench Press')
        cy.get('[data-cy=exercise-reps-input]').clear().type('12')
        cy.get('[data-cy=exercise-sets-input]').clear().type('3')
        cy.get('[data-cy=exercise-load-input]').clear().type('7.5')
        cy.get('button').contains('Save').click()

        cy.get('button').contains('Delete').click()
        cy.get(':nth-child(2) > div > [data-cy=remove-exercise-btn]').click()
        cy.get('[data-cy=exercise-name-p').should('not.contain.text', 'Shoulder Press')

        cy.get('button').contains('Cancel').click()
        cy.get('[data-cy=exercise-name-p').should('contain.text', 'Shoulder Press')

        cy.get('button').contains('Delete').click()
        cy.get(':nth-child(2) > div > [data-cy=remove-exercise-btn]').click()
        cy.get('[data-cy=exercise-name-p').should('not.contain.text', 'Shoulder Press')

        cy.get('button').contains('Save').click()
        cy.get('[data-cy=exercise-name-p').should('not.contain.text', 'Shoulder Press')
    })
})