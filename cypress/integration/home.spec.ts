/// <reference types="cypress" />

describe('Testing home page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
    })

    it('should redirect to splits page', () => {
        cy.get('a').contains("Splits").click()
        cy.get('a').should('contain.text', 'New Split')
    })
})

describe('Testing login page', () => {
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
})