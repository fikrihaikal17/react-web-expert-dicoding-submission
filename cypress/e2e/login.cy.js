/**
 * Skenario test:
 * - should login successfully and redirect user to home page.
 */

describe('Login flow', () => {
  it('should login successfully and show authenticated navigation', () => {
    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/users', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          users: [
            {
              id: 'user-1',
              name: 'User Test',
              email: 'user@test.com',
              avatar: 'https://example.com/avatar.png',
            },
          ],
        },
      },
    }).as('getUsers');

    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/threads', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          threads: [
            {
              id: 'thread-1',
              title: 'Thread Satu',
              body: '<p>Isi thread satu</p>',
              category: 'react',
              createdAt: '2026-04-20T08:00:00.000Z',
              ownerId: 'user-1',
              totalComments: 0,
              upVotesBy: [],
              downVotesBy: [],
            },
          ],
        },
      },
    }).as('getThreads');

    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/leaderboards', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          leaderboards: [
            {
              user: {
                id: 'user-1',
                name: 'User Test',
                avatar: 'https://example.com/avatar.png',
              },
              score: 10,
            },
          ],
        },
      },
    }).as('getLeaderboards');

    cy.intercept('POST', 'https://forum-api.dicoding.dev/v1/login', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          token: 'token-123',
        },
      },
    }).as('postLogin');

    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/users/me', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          user: {
            id: 'user-1',
            name: 'User Test',
            email: 'user@test.com',
            avatar: 'https://example.com/avatar.png',
          },
        },
      },
    }).as('getOwnProfile');

    cy.visit('/login');

    cy.wait(['@getUsers', '@getThreads', '@getLeaderboards']);

    cy.get('input[name="email"]').type('user@test.com');
    cy.get('input[name="password"]').type('secret123');
    cy.contains('button', /^Login$/i).click();

    cy.wait(['@postLogin', '@getOwnProfile']);

    cy.url().should('include', '/');
    cy.contains(/Logout/i).should('be.visible');
  });
});
