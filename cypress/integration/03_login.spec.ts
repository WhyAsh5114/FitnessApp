/// <reference types="cypress" />

describe('Testing login', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/profile')
    })

    it('should redirect to login instead of profile', () => {
        cy.get('h1').should('contain.text', 'Login to continue');
    })

    it('should throw error (user not found)', () => {
        cy.get('input[placeholder=Username]').type('unknown_username')
        cy.get('input[placeholder=Password]').type('unknown_password')
        cy.get('button').contains('Submit').click()
        cy.get('li').contains('Not Found')
    })

    it('should throw error (incorrect password)', () => {
        cy.get('input[placeholder=Username]').type('sample_username')
        cy.get('input[placeholder=Password]').type('wrong_password')
        cy.get('button').contains('Submit').click()
        cy.get('li').contains('Unauthorized')
    })

    it('should redirect to profile after logging in', () => {
        cy.get('input[placeholder=Username]').type('sample_username')
        cy.get('input[placeholder=Password]').type('sample_password')
        cy.get('button').contains('Submit').click()
        cy.get('p').should('contain.text', 'Hi sample_username')
    })
})