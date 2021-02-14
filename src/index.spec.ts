import * as api from './index'

test('public api', () => {
  expect(Object.keys(api)).toMatchSnapshot()
})
