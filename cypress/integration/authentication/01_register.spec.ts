/// <reference types="cypress" />

describe('Testing register', () => {
    before(() => {
        // Clear database to avoid conflicts
        cy.task('flushDB')
    })

    beforeEach(() => {
        cy.visit('http://localhost:3000/profile/create_account')
    })

    it('should throw error (Username and password cannot be empty)', () => {
        cy.get('button').contains('Submit').click()
        cy.get('li').should('contain.text', 'Username cannot be empty')
        cy.get('li').should('contain.text', 'Password cannot be empty')
    })

    it('should throw error (Username cannot be empty)', () => {
        cy.get('input[placeholder=Password]').type('sample_password')
        cy.get('button').contains('Submit').click()
        cy.get('li').should('contain.text', 'Username cannot be empty')
    })

    it('should throw error (Password cannot be empty)', () => {
        cy.get('input[placeholder=Username]').type('sample_username')
        cy.get('button').contains('Submit').click()
        cy.get('li').should('contain.text', 'Password cannot be empty')
    })

    it('should throw error (Passwords do not match)', () => {
        cy.get('input[placeholder=Username]').type('sample_username')
        cy.get('input[placeholder=Password]').type('sample_password')
        cy.get('input[placeholder="Confirm Password"]').type('incorrect_password')
        cy.get('button').contains('Submit').click()
        cy.get('li').should('contain.text', 'Passwords do not match')
    })

    it('should redirect to profile after creating user', () => {
        cy.get('input[placeholder=Username]').type('sample_username')
        cy.get('input[placeholder=Password]').type('sample_password')
        cy.get('input[placeholder="Confirm Password"]').type('sample_password')
        cy.get('button').contains('Submit').click()
        cy.get('p').should('contain.text', 'Hi sample_username')
    })
})