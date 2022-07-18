/// <reference types="cypress" />

Cypress.Commands.add('login', (username: string, password: string) => {
	cy.session([username, password], () => {
		cy.visit('http://localhost:3000/profile/login');
		cy.get('[placeholder=Username]').type(username);
		cy.get('[placeholder=Password]').type(password);
		cy.get('button').contains('Submit').click();
		cy.url().should('equal', 'http://localhost:3000/profile');
	});
});
