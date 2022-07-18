/// <reference types="cypress" />

describe('Testing home page', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000');
	});

	it('should redirect to splits page', () => {
		cy.get('a').contains('Splits').click();
		cy.get('a').should('contain.text', 'New Split');
	});

	it('should redirect to logging page', () => {
		cy.get('a').contains('Logging').click();
		cy.get('a').should('contain.text', 'Log Workout');
	});

	it('should redirect to records page', () => {
		cy.get('a').contains('Records').click();
		cy.get('a').should('contain.text', 'Splits Records');
	});

	it('should redirect to tracking page', () => {
		cy.get('a').contains('Tracking').click();
	});
});
