import {expect, test} from '@jest/globals'
import {GetDateFormatted} from '../src/utils'
import {parseYAML} from '../src/utils'

test('date parsing', () => {
  const date = new Date(2021, 0, 16, 11, 43, 0, 0)
  const result = GetDateFormatted(date)

  expect(result).toHaveLength(13)
  expect(result).toMatch('20210116_1143')
})

test(`check parseYAML with normal strings`, () => {
  const content = `
  name: 'test-name'
  author: 'test-author'
  description: 'email@testing.com-+-'
  runs:\n    using: 'test'`
  const filePath = 'test'
  const result = parseYAML(filePath, 'test', content)

  expect(result.name).toBe('test-name')
  expect(result.author).toBe('test-author')
  expect(result.description).toBe('email&commat;testing&period;com-&plus;-')
  expect(result.using).toBe('test')
})

test(`check html encode funciton`, () => {
  const content = `
  name: '<test script="injection">'
  author: '<injection test in author>'
  description: 'injection test in description ( < > " &'
  runs:\n    using: 'testwithquote"'
  `

  const filePath = 'test'
  const result = parseYAML(filePath, 'test', content)

  expect(result.name).toBe('&lt;test script&equals;&quot;injection&quot;&gt;')
  expect(result.author).toBe('&lt;injection test in author&gt;')
  expect(result.description).toBe(
    `injection test in description &lpar; &lt; &gt; &quot; &amp;`
  )
  expect(result.using).toBe('testwithquote&quot;')
})
