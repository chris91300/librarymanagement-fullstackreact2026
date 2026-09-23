describe('Book list', () => {
  it('should display books returned by the API', () => {
    cy.intercept('GET', 'http://localhost:3000/books', {
      statusCode: 200,
      body: [
        {
          id: 1,
          title: 'Dune',
          author: 'Frank Herbert',
          available_copies: 3,
          total_copies: 3,
        },
      ],
    }).as('getBooks');

    cy.visit('http://localhost:4200');

    cy.wait('@getBooks');

    cy.get('.book-item')
      .should('have.length.at.least', 1)
      .and('contain.text', 'Dune');
  });

  // ici je n'utilise pas les data-cy pour voir comment faire sans
  it('should add a book', () => {
    cy.intercept('POST', 'http://localhost:3000/books').as('addBook');

    cy.visit('http://localhost:4200');

    cy.get("nav a").eq(1).click();

    cy.get('#title').clear().type('Un nouveau livre');
    cy.get('#author').clear().type('Michel Christophe');
    cy.get('#copies').clear().type('10');

    cy.contains("button", "Add Book").click();
    cy.wait('@addBook');

    cy.contains(".book-item", "Un nouveau livre")

  });


  // à partir d'ici j'utilise parfois des data-cy
  it('should remove a book', () => {
    cy.intercept('POST', 'http://localhost:3000/books').as('addBook');

    cy.visit('http://localhost:4200');

    cy.get('[data-cy="link-add-book"]').click();

    cy.get('#title').clear().type('Un livre');
    cy.get('#author').clear().type('Michel Christophe');
    cy.get('#copies').clear().type('1');

    cy.contains("button", "Add Book").click();
    cy.wait('@addBook');

    cy.contains(".book-item", "Un livre").should("be.visible")

    cy.get('[data-cy="button-delete-book-un-livre"]').click();
    cy.contains(".book-item", "Un livre").should("not.be.exist")
  });

  it('should decrease availableCopies when user borrow a book', () => {

    cy.visit('http://localhost:4200');

    cy.get('[data-cy="tr-book-la-vie-de-michel-available-copies"]').then(($e) => {
      const availableCopiesAtBegining = Number($e.text());

      cy.get('[data-cy="button-borrow-book-la-vie-de-michel"]').click();

      const newValueOfAvailableCopies = String(availableCopiesAtBegining - 1);
      cy.get('[data-cy="tr-book-la-vie-de-michel-available-copies"]').should("have.text", newValueOfAvailableCopies)
    })
  });
});