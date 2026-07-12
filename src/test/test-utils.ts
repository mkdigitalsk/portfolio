// Single import surface for every test: render+providers, RTL queries, user-event, MSW server + fakes.
export { default as userEvent } from '@testing-library/user-event'
export * from './renderWithProviders'
export { server } from './server'
export { http, HttpResponse } from 'msw'
export * from './fakes'
